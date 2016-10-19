var debug = require('debug')('server:api:v1:user:DAL');
var d3 = require("d3");
var DateLibrary = require('date-management');
var common = require('../common');
var constant = require('../constant');
var query = require('./user.query');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;

//For Easy Pay
var checkUserIsExistAdmin = function (email, cb) {
    debug("user.DAL -> checkUserIsExistAdmin");
    var checkUserIsExistAdminQuery = common.cloneObject(query.checkUserIsExistAdminQuery);
    checkUserIsExistAdminQuery.filter.value = email;
    common.executeQuery(checkUserIsExistAdminQuery, cb);
}

var checkUserIsExist = function (countryCode, mobile, cb) {
    debug("user.DAL -> checkUserIsExist");
    var checkUserIsExistQuery = common.cloneObject(query.checkUserIsExistQuery);
    checkUserIsExistQuery.filter.and[0].value = countryCode;
    checkUserIsExistQuery.filter.and[1].value = mobile;
    common.executeQuery(checkUserIsExistQuery, cb);
};

var validateUser = function (userId, password, cb) {
    debug("user.DAL -> checkUserIsExist");
    var validateUserQuery = common.cloneObject(query.validateUserQuery);
    validateUserQuery.filter.and[0].value = userId;
    validateUserQuery.filter.and[1].value = password;
    common.executeQuery(validateUserQuery, cb);
};

//Create the user Easy-Pay
var createUserAdmin = function (name, email, password, cb) {
    debug("user.DAL -> createUserAdmin");
    var createUserEasyAdmin = common.cloneObject(query.createUserEasyAdmin);
    createUserEasyAdmin.insert.fValue = [name, email, password, 1];
    common.executeQuery(createUserEasyAdmin, cb);
}


var createUser = function (countryCode, mobile, cb) {
    debug("user.DAL -> createUser");
    var createUserQuery = common.cloneObject(query.createUserQuery);
    createUserQuery.insert.fValue = [mobile, countryCode];
    common.executeQuery(createUserQuery, cb);
};

var checkOTPLimit = function (countryCode, mobile, cb) {
    debug("user.DAL -> checkOTPLimit");
    var checkOTPLimitQuery = common.cloneObject(query.checkOTPLimitQuery);
    var currDate = new Date();
    var startDate = d3.timeFormat(dbDateFormat)(DateLibrary.getRelativeDate(currDate, {
        operationType: "First_Date",
        granularityType: "Days"
    }));
    var endDate = d3.timeFormat(dbDateFormat)(DateLibrary.getRelativeDate(currDate, {
        operationType: "Last_Date",
        granularityType: "Days"
    }));
    checkOTPLimitQuery.filter.and[0].value = countryCode;
    checkOTPLimitQuery.filter.and[1].value = mobile;
    checkOTPLimitQuery.filter.and[2].value = startDate;
    checkOTPLimitQuery.filter.and[3].value = endDate;
    common.executeQuery(checkOTPLimitQuery, cb);
};

var exprieOTP = function (countryCode, mobile, cb) {
    debug("user.DAL -> exprieOTP");
    var updateOTPQuery = common.cloneObject(query.updateOTPQuery);
    updateOTPQuery.filter.and[0].value = countryCode;
    updateOTPQuery.filter.and[1].value = mobile;
    common.executeQuery(updateOTPQuery, cb);
};

var saveOTP = function (countryCode, mobile, OTP, expiryDateTime, cb) {
    debug("user.DAL -> saveOTP");
    var saveOTPQuery = common.cloneObject(query.saveOTPQuery);
    var dbExpiryDateTime = d3.timeFormat(dbDateFormat)(new Date(expiryDateTime));
    saveOTPQuery.insert.fValue = [countryCode, mobile, OTP, dbExpiryDateTime];
    common.executeQuery(saveOTPQuery, cb);
};

var validOTP = function (countryCode, mobile, currDateTime, cb) {
    debug("user.DAL -> validOTP");
    var verifyOTPQuery = common.cloneObject(query.verifyOTPQuery);
    verifyOTPQuery.filter.and[0].value = countryCode;
    verifyOTPQuery.filter.and[1].value = mobile;
    verifyOTPQuery.filter.and[2].value = d3.timeFormat(dbDateFormat)(currDateTime);
    common.executeQuery(verifyOTPQuery, cb);
};

var updateUserInfoByCountryCodeAndMobile = function (countryCode, mobile, fieldValue, cb) {
    debug("user.DAL -> updateUserInfoByCountryCodeAndMobile");
    var updateUserQuery = common.cloneObject(query.updateUserQuery);
    updateUserQuery.filter.and[1].or[0].and[0].value = countryCode;
    updateUserQuery.filter.and[1].or[0].and[1].value = mobile;
    updateUserQuery.update = fieldValue;
    common.executeQuery(updateUserQuery, cb);
};

var updateUserInfoById = function (userId, fieldValue, cb) {
    debug("user.DAL -> updateUserInfoById");
    var updateUserQuery = common.cloneObject(query.updateUserQuery);
    updateUserQuery.filter.and[1].or[1].value = userId;
    updateUserQuery.update = fieldValue;
    common.executeQuery(updateUserQuery, cb);
};

var getUserInfoByCountryCodeAndMobile = function (countryCode, mobile, cb) {
    debug("user.DAL -> getUserInfoByCountryCodeAndMobile");
    var getUserInfoQuery = common.cloneObject(query.getUserInfoQuery);
    getUserInfoQuery.filter.and[1].or[0].and[0].value = countryCode;
    getUserInfoQuery.filter.and[1].or[0].and[1].value = mobile;
    common.executeQuery(getUserInfoQuery, cb);
};

var getUserInfoById = function (userId, cb) {
    debug("user.DAL -> getUserInfoById");
    var getUserInfoQuery = common.cloneObject(query.getUserInfoQuery);
    getUserInfoQuery.filter.and[1].or[1].value = userId;
    common.executeQuery(getUserInfoQuery, cb);
};

var userLogin = function (countryCode, mobile, password, cb) {
    debug("user.DAL -> userLogin");
    var getUserInfoQuery = common.cloneObject(query.getUserInfoQuery);
    getUserInfoQuery.filter.and[1].or[2].and[0].value = countryCode;
    getUserInfoQuery.filter.and[1].or[2].and[1].value = mobile;
    getUserInfoQuery.filter.and[1].or[2].and[2].value = password;
    common.executeQuery(getUserInfoQuery, cb);
};
var userLoginAdmin = function (email, password, cb) {
    debug("user.DAL -> userLogin admin");
    var getUserInfoQueryAdmin = common.cloneObject(query.getUserInfoQueryAdmin);
    getUserInfoQueryAdmin.filter.and[2].value = email;
    getUserInfoQueryAdmin.filter.and[3].value = password;
    common.executeQuery(getUserInfoQueryAdmin, cb);
}
var exprieAccessToken = function (userId, deviceId, cb) {
    debug("user.DAL -> exprieAccessToken");
    var updateAccessTokenQuery = common.cloneObject(query.updateAccessTokenQuery);
    if (userId === undefined) {
        updateAccessTokenQuery.filter.or[1].value = deviceId;
    } else {
        updateAccessTokenQuery.filter.or[0].and[0].value = userId;
        updateAccessTokenQuery.filter.or[0].and[1].value = deviceId;
    }
    common.executeQuery(updateAccessTokenQuery, cb);
};

var createAccessToken = function (userId, token, expiryDateTime, deviceId, cb) {
    debug("user.DAL -> accessTokenGenerate");
    var insertAccessTokenQuery = common.cloneObject(query.insertAccessTokenQuery);
    var dbExpiryDateTime = d3.timeFormat(dbDateFormat)(new Date(expiryDateTime));
    insertAccessTokenQuery.insert.fValue = [userId, token, dbExpiryDateTime, deviceId];
    common.executeQuery(insertAccessTokenQuery, cb);
};

var checkUserTransaction = function (deviceId, deviceType, cb) {
    debug("user.DAL -> checkUserTransaction");
    var checkUserTransactionQuery = common.cloneObject(query.checkUserTransactionQuery);
    checkUserTransactionQuery.filter.and[0].value = deviceId;
    checkUserTransactionQuery.filter.and[1].value = deviceType;
    common.executeQuery(checkUserTransactionQuery, cb);
};

var updateUserTransaction = function (deviceId, deviceType, fieldValue, cb) {
    debug("user.DAL -> updateUserTransaction");
    var updateUserTransactionQuery = common.cloneObject(query.updateUserTransactionQuery);
    updateUserTransactionQuery.filter.and[0].value = deviceId;
    updateUserTransactionQuery.filter.and[1].value = deviceType;
    updateUserTransactionQuery.update = fieldValue;
    common.executeQuery(updateUserTransactionQuery, cb);
};

var createUserTransaction = function (deviceId, deviceType, cb) {
    debug("user.DAL -> createUserTransaction");
    var insertUserTransactionQuery = common.cloneObject(query.insertUserTransactionQuery);
    insertUserTransactionQuery.insert.fValue = [deviceId, deviceType];
    common.executeQuery(insertUserTransactionQuery, cb);
};

module.exports = {
    checkUserIsExist: checkUserIsExist,
    checkUserIsExistAdmin: checkUserIsExistAdmin,
    createUser: createUser,
    createUserAdmin: createUserAdmin,
    checkOTPLimit: checkOTPLimit,
    exprieOTP: exprieOTP,
    saveOTP: saveOTP,
    validOTP: validOTP,
    validateUser: validateUser,
    updateUserInfoByCountryCodeAndMobile: updateUserInfoByCountryCodeAndMobile,
    updateUserInfoById: updateUserInfoById,
    getUserInfoByCountryCodeAndMobile: getUserInfoByCountryCodeAndMobile,
    getUserInfoById: getUserInfoById,
    userLogin: userLogin,
    userLoginAdmin:userLoginAdmin,
    exprieAccessToken: exprieAccessToken,
    createAccessToken: createAccessToken,
    createUserTransaction: createUserTransaction,
    checkUserTransaction: checkUserTransaction,
    updateUserTransaction: updateUserTransaction
};
