var debug = require('debug')('server:middleware');
var d3 = require("d3");
var uuid = require('uuid');
var randomstring = require("randomstring");
var constant = require('../server/api/v1/constant');
var queryExecutor = require('./helper/mySql');
var config = require('../config');

var checkRequestHeader = function(request, response, next) {
  debug("middleware -> checkRequestHeader");
  var api_key = request.headers["api-key"];
  var udid = request.headers["udid"];
  var device_type = request.headers["device-type"];
  if (api_key === undefined) {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_API_KEY_NOT_FOUND
    });

  } else if (api_key != constant.appConfig.APPLICATION_API_KEY) {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_INVALID_API_KEY
    });
  } else if (udid === undefined) {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_UDID_NOT_FOUND
    });
  } else if (device_type === undefined) {
    return response.send({
      status: false,
      error: constant.requestMessages.ERR_DEVICE_TYPE_NOT_FOUND
    });
  }
  next();
};

var checkAccessToken = function(request, response, next) {
  debug("middleware -> checkAccessToken");
  var accessToken = request.headers["authorization"];
  var udid = request.headers["udid"];
  if (accessToken === undefined && request.method === "GET") {
    if (request.session.userInfo === undefined) {
      request.session.userInfo = {
        accessToken: uuid.v1(),
        userId: '-1',
        name: 'Guest' + randomstring.generate({
          "length": 4,
          "charset": 'numeric'
        }),
        mobile: '9XXXXXXXXX'
      };
    }
    debug("Guest Session: ", request.session.userInfo);
    next();
    return;
  }
  if (accessToken === undefined) {
    response.statusCode = 401;
    return response.send({
      status: false,
      error: {
        code: 401,
        message: "Unauthorized access"
      }
    });
  } else {
    var jsonQuery = {
      table: "view_AccessToken",
      select: [{
        field: 'userId',
      }, {
        field: 'name',
      }, {
        field: 'mobile',
      }],
      filter: {
        and: [{
          field: 'deviceId',
          operator: 'EQ',
          value: udid
        }, {
          field: 'token',
          operator: 'EQ',
          value: accessToken
        }]
      }
    };
    queryExecutor.executeQuery(jsonQuery, function(result) {
      if (result.status === false) {
        return response.send({
          status: false,
          error: {
            code: 9000,
            message: "Error in executeQuery"
          }
        });
      } else if (result.content.length === 0) {
        response.statusCode = 401;
        return response.send({
          status: false,
          error: {
            code: 401,
            message: "Unauthorized access"
          }
        });
      }
      if (request.session.userInfo === undefined) {
        request.session.userInfo = {
          accessToken: accessToken,
          userId: result.content[0].userId,
          name: result.content[0].name,
          mobile: result.content[0].mobile
        };
      }
      debug("Session: ", request.session.userInfo);
      next();
    });
  }
};

var logger = function(request, response, next) {
  var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
  var userId = -1;
  if (request.session.userInfo !== undefined) {
    userId = request.session.userInfo.userId;
  }
  var type = request.method;
  var headers = JSON.stringify(request.headers);
  var body = JSON.stringify(request.body);
  var params = JSON.stringify(request.params);
  var query = JSON.stringify(request.query);
  var ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
  debug("requested ipAddress: ", ipAddress);
  debug("request HTTP method: ", type);
  debug("request headers: ", headers);
  debug("request body: ", body);
  debug("request params: ", params);
  debug("request query: ", query);
  debug("request URL: ", fullUrl);
  debug("requested userID: ", userId);
  if (config.isLogger === true) {
    var jsonQuery = {
      table: "tbl_Logger",
      insert: {
        field: ["type", "URL", "headers", "body", "params", "query", "fk_userID", "ipAddress"],
        fValue: [type, fullUrl, headers, body, params, query, userId, ipAddress]
      }
    };

    queryExecutor.executeQuery(jsonQuery, function(result) {
      if (result.status === false) {
        return response.send({
          status: false,
          error: {
            code: 9000,
            message: "Error in executeQuery"
          }
        });
      }
    });
  }
  next();
};

module.exports = {
  checkRequestHeader: checkRequestHeader,
  checkAccessToken: checkAccessToken,
  logger: logger
};
