var debug = require('debug')('server:api:v1:user:service');
var d3 = require("d3");
var md5 = require('md5');
var uuid = require('uuid');
var DateLibrary = require('date-management');
var randomstring = require("randomstring");
var common = require('../common');
var constant = require('../constant');
var userDAL = require('./user.DAL');
var dbDateFormat = constant.appConfig.DB_DATE_FORMAT;

/**
 * Created By: AV
 * Updated By: AV
 *
 * signup service
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
   IF Check User is Exist (id,mobile,country_code,is_active,is_verify)
    IF is_active is false
      - user is not active messgae
    ELSE IF is_verify is true
      - user is already exist
    ELSE
      - Generate OTP
      - Save Into OTP table
      - Send OTP
   ELSE
    - Insert User Info
    - Generate OTP
    - Save Into OTP table
    - Send OTP
 */
var signupServiceAdmin = function (request, cb) {
    debug("user.service -> signupServiceAdmin");
    if (request.body.name === undefined || request.body.email === undefined || request.body.password === undefined) {
        cb({ status: false, error: constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST });
        return;
    }
    var name = request.body.name;
    var password = md5(request.body.password);
    var email = request.body.email;

    userDAL.checkUserIsExistAdmin(email, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        }
        else if (result.content.length > 0) {
            var userInfo = result.content[0];
            // check user is active or not
            if (userInfo.is_active == false) {
                cb({
                    status: false,
                    error: constant.userMessages.ERR_USER_IS_NOT_ACTIVE
                });
                // check user is verify or not
            } else if (userInfo.is_verify == true) {
                cb({
                    status: false,
                    error: constant.userMessages.ERR_USER_IS_ALREADY_EXIST
                });
            }
            return;
        }
        // save user info easy pay
        userDAL.createUserAdmin(name, email, password, function (result) {
            if (result.status === false) {
                cb(result);
            } else {
                cb({
                    status: true,
                    data: constant.userMessages.MSG_SIGNUP_SUCCESSFULLY
                });
            }
        });
    });
}
var signupService = function (request, cb) {
    debug("user.service -> signupService");
    if (request.body.mobile === undefined || request.body.country_code === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST
        });
        return;
    }
    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    userDAL.checkUserIsExist(countryCode, mobile, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        } else if (result.content.length > 0) {
            var userInfo = result.content[0];
            // check user is active or not
            if (userInfo.is_active == false) {
                cb({
                    status: false,
                    error: constant.userMessages.ERR_USER_IS_NOT_ACTIVE
                });
                // check user is verify or not
            } else if (userInfo.is_verify == true) {
                cb({
                    status: false,
                    error: constant.userMessages.ERR_USER_IS_ALREADY_EXIST
                });
            } else {
                // if user is allready exist but not verify than send OTP
                sendOTP(userInfo.country_code, userInfo.mobile, cb);
            }
            return;
        }

        // save user info and save & send otp
        userDAL.createUser(countryCode, mobile, function (result) {
            if (result.status === false) {
                cb(result);
            } else {
                sendOTP(countryCode, mobile, cb);
            }
        }); // END createUser
    }); // END checkUserIsExist
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * signinWithOTP service
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var signinWithOTPService = function (request, cb) {
    debug("user.service -> signinWithOTPService");
    if (request.body.mobile === undefined || request.body.country_code === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
        return;
    }
    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    userDAL.checkUserIsExist(countryCode, mobile, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        } else if (result.content.length > 0) {
            var userInfo = result.content[0];
            // check user is active or not
            if (userInfo.is_active == false) {
                cb({
                    status: false,
                    error: constant.userMessages.ERR_USER_IS_NOT_ACTIVE
                });
                // check user is verify or not
            } else if (userInfo.is_verify == true) {
                sendOTP(userInfo.country_code, userInfo.mobile, function (result) {
                    if (result.status === false) {
                        cb(result);
                        return;
                    }
                    if (userInfo.name.length !== 0 || userInfo.player_skill.length !== 0) {
                        result.data.is_new = false;
                    } else {
                        result.data.is_new = true;
                    }
                    cb(result);
                });
            } else {
                // if user is allready exist but not login first time
                sendOTP(userInfo.country_code, userInfo.mobile, function (result) {
                    if (result.status === false) {
                        cb(result);
                        return;
                    }
                    console.log("Name" + userInfo.name)
                    if (result.length !== 0) {
                        result.data.is_new = false;
                    } else {
                        result.data.is_new = true;
                    }
                    cb(result);
                });
            }
            return;
        }

        // save user info and save & send otp
        userDAL.createUser(countryCode, mobile, function (result) {
            if (result.status === false) {
                cb(result);
            } else {
                sendOTP(countryCode, mobile, function (result) {
                    if (result.status === false) {
                        cb(result);
                        return;
                    }
                    result.data.is_new = true;
                    cb(result);
                });
            }
        }); // END createUser
    }); // END checkUserIsExist
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * verify OTP service
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var verifyOTPNewService = function (request, cb) {
    debug("user.service -> verifyOTPNewService");
    if (request.body.mobile === undefined || request.body.country_code === undefined || request.body.otp === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_VERIFY_OTP_REQUEST
        });
        return;
    }
    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    var OTP = request.body.otp;
    verifyOTP(countryCode, mobile, OTP, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        }

        // user profile picture link generate
        var data = [result.data];
        var newData = generateUserProfilePictureURL(data, request);

        var userInfo = newData[0];
        var userId = userInfo.user_id;
        var token = uuid.v1();
        var deviceId = request.headers["udid"];
        var deviceType = (request.headers["device-type"]).toLowerCase();
        var expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
            operationType: "Absolute_DateTime",
            granularityType: "hours",
            value: constant.appConfig.MAX_ACCESS_TOKEN_EXPIRY_HOURS
        });

        userDAL.exprieAccessToken(userId, deviceId, function (result) {
            if (result.status === false) {
                cb(result);
            } else {
                userDAL.createAccessToken(userId, token, expiryDateTime, deviceId, function (result) {
                    if (result.status === false) {
                        cb(result);
                    } else {
                        userDAL.checkUserTransaction(deviceId, deviceType, function (result) {
                            if (result.status === false) {
                                cb(result);
                            } else if (result.content[0].totalCount > 0) {
                                var fieldValueUpdate = [];
                                fieldValueUpdate.push({
                                    field: "isLogedIn",
                                    fValue: 1
                                });
                                fieldValueUpdate.push({
                                    field: "lastLoginDatetime",
                                    fValue: d3.timeFormat(dbDateFormat)(new Date())
                                });
                                userDAL.updateUserTransaction(deviceId, deviceType, fieldValueUpdate, function (result) {
                                    if (result.status === false) {
                                        cb(result);
                                    } else {
                                        cb({
                                            status: true,
                                            "access_token": token,
                                            data: userInfo
                                        });
                                    }
                                }); // updateUserTransaction end
                            } else if (result.content[0].totalCount === 0) {
                                userDAL.createUserTransaction(deviceId, deviceType, function (result) {
                                    if (result.status === false) {
                                        cb(result);
                                    } else {
                                        cb({
                                            status: true,
                                            "access_token": token,
                                            data: userInfo
                                        });
                                    }
                                }); // createUserTransaction end
                            }
                        }); // checkUserTransaction end
                    }
                }); // createAccessToken end
            }
        }); // exprieAccessToken end
    });
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * resend OTP service send OTP agin user register mobile number
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var resendOTPService = function (request, cb) {
    debug("user.service -> resendOTPService");
    if (request.body.mobile === undefined || request.body.country_code === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_RESEND_OTP_REQUEST
        });
        return;
    }
    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    userDAL.checkUserIsExist(countryCode, mobile, function (result) {
        if (result.status === false) {
            cb(result);
        } else if (result.content.length === 0) {
            cb({
                status: false,
                error: constant.userMessages.ERR_USER_NOT_EXIST
            });
            return;
        }
        sendOTP(countryCode, mobile, cb);
    });
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * verify OTP service
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var verifyOTPService = function (request, cb) {
    debug("user.service -> verifyOTPService");
    if (request.body.mobile === undefined || request.body.country_code === undefined || request.body.otp === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_VERIFY_OTP_REQUEST
        });
        return;
    }
    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    var OTP = request.body.otp;
    verifyOTP(countryCode, mobile, OTP, cb);
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * update user profile base on userID
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var updateProfileService = function (request, cb) {
    debug("user.service -> updateProfileService");
    if (request.body.user_id === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_USER_PROFILE_UPDATE_REQUEST
        });
        return;
    }
    var userId = request.body.user_id;
    var userInfo = {};
    userInfo.name = request.body.name;
    userInfo.password = request.body.password;
    userInfo.email = request.body.email;
    userInfo.playerSkill = request.body.player_skill;
    userInfo.fk_bowlingTypeID = request.body.bowling_type_id;
    userInfo.battingHand = request.body.batting_hand;
    userInfo.photo = request.body.photo;
    userInfo.DOB = request.body.dob;
    userInfo.fk_cityID = request.body.city_id;
    userInfo.fk_playingRoleID = request.body.playing_role_id;

    var userKeys = Object.keys(userInfo);
    var fieldValueUpdate = [];
    userKeys.forEach(function (userKey) {
        if (userInfo[userKey] !== undefined) {
            var fieldValueObj = {};
            if (userKey === 'password') {
                fieldValueObj = {
                    field: userKey,
                    fValue: md5(userInfo[userKey])
                };
            } else {
                fieldValueObj = {
                    field: userKey,
                    fValue: userInfo[userKey]
                };
            }
            fieldValueUpdate.push(fieldValueObj);
        }
    });

    userDAL.updateUserInfoById(userId, fieldValueUpdate, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        }
        // Get UserINFO
        userDAL.getUserInfoById(userId, function (result) {
            if (result.status === false) {
                cb(result);
            } else if (result.content.length === 0) {
                cb({
                    status: false,
                    error: constant.userMessages.ERR_USER_NOT_EXIST
                });
            } else {
                // user profile picture link generate
                var data = result.content;
                var newData = generateUserProfilePictureURL(data, request);
                cb({
                    status: true,
                    data: newData[0]
                });
            }
        }); // getUserInfoById end
    }); //updateUserInfoById end
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * signin using mobileNumber with countryCode and password
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var signinService = function (request, cb) {
    debug("user.service -> signinService");
    if (request.body.country_code === undefined || request.body.mobile === undefined || request.body.password === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
        return;
    }
    var countryCode = request.body.country_code;
    var mobile = request.body.mobile;
    var password = md5(request.body.password);
    userDAL.userLogin(countryCode, mobile, password, function (result) {
        if (result.status === false) {
            cb(result);
        } else if (result.content.length === 0) {
            cb({
                status: false,
                error: constant.userMessages.ERR_INVALID_MOBILE_AND_PASSWORD
            });
        } else {
            var userInfo = result.content[0];
            var userId = userInfo.user_id;
            var token = uuid.v1();
            var deviceId = request.headers["udid"];
            var deviceType = (request.headers["device-type"]).toLowerCase();
            var expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
                operationType: "Absolute_DateTime",
                granularityType: "hours",
                value: constant.appConfig.MAX_ACCESS_TOKEN_EXPIRY_HOURS
            });

            userDAL.exprieAccessToken(userId, deviceId, function (result) {
                if (result.status === false) {
                    cb(result);
                } else {
                    userDAL.createAccessToken(userId, token, expiryDateTime, deviceId, function (result) {
                        if (result.status === false) {
                            cb(result);
                        } else {
                            userDAL.checkUserTransaction(deviceId, deviceType, function (result) {
                                if (result.status === false) {
                                    cb(result);
                                } else if (result.content[0].totalCount > 0) {
                                    var fieldValueUpdate = [];
                                    fieldValueUpdate.push({
                                        field: "isLogedIn",
                                        fValue: 1
                                    });
                                    fieldValueUpdate.push({
                                        field: "lastLoginDatetime",
                                        fValue: d3.timeFormat(dbDateFormat)(new Date())
                                    });
                                    userDAL.updateUserTransaction(deviceId, deviceType, fieldValueUpdate, function (result) {
                                        if (result.status === false) {
                                            cb(result);
                                        } else {
                                            cb({
                                                status: true,
                                                "access_token": token,
                                                data: userInfo
                                            });
                                        }
                                    }); // updateUserTransaction end
                                } else if (result.content[0].totalCount === 0) {
                                    userDAL.createUserTransaction(deviceId, deviceType, function (result) {
                                        if (result.status === false) {
                                            cb(result);
                                        } else {
                                            cb({
                                                status: true,
                                                "access_token": token,
                                                data: userInfo
                                            });
                                        }
                                    }); // createUserTransaction end
                                }
                            }); // checkUserTransaction end
                        }
                    }); // createAccessToken end
                }
            }); // exprieAccessToken end
        }
    }); // userLogin end
};
var signinServiceAdmin = function (request, cb) {
    debug("user.service -> signin service admin");
    if (request.body.email === undefined || request.body.password === undefined) {
        cb({ status: false, error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST });
        return;
    }
    var email = request.body.email;
    var password = md5(request.body.password);
    userDAL.userLoginAdmin(email, password, function (result) {
        if (result.status === false) {
            cb(result);
        }
        else if (result.content.length === 0) {
            cb({ status: false, error: constant.userMessages.ERR_INVALID_EMAIL_AND_PASSWORD });
        }
        else {
            var userInfo = result.content[0];
            var userId = userInfo.user_id;
            var token = uuid.v1();
            var deviceId = request.headers["udid"];
            var deviceType = (request.headers["device-type"]).toLowerCase();
            var expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
                operationType: "Absolute_DateTime",
                granularityType: "hours",
                value: constant.appConfig.MAX_ACCESS_TOKEN_EXPIRY_HOURS
            });

            userDAL.exprieAccessToken(userId, deviceId, function (result) {
                if (result.status === false) {
                    cb(result);
                } else {
                    userDAL.createAccessToken(userId, token, expiryDateTime, deviceId, function (result) {
                        if (result.status === false) {
                            cb(result);
                        } else {
                            userDAL.checkUserTransaction(deviceId, deviceType, function (result) {
                                if (result.status === false) {
                                    cb(result);
                                } else if (result.content[0].totalCount > 0) {
                                    var fieldValueUpdate = [];
                                    fieldValueUpdate.push({
                                        field: "isLogedIn",
                                        fValue: 1
                                    });
                                    fieldValueUpdate.push({
                                        field: "lastLoginDatetime",
                                        fValue: d3.timeFormat(dbDateFormat)(new Date())
                                    });
                                    userDAL.updateUserTransaction(deviceId, deviceType, fieldValueUpdate, function (result) {
                                        if (result.status === false) {
                                            cb(result);
                                        } else {
                                            cb({
                                                status: true,
                                                "access_token": token,
                                                data: userInfo
                                            });
                                        }
                                    }); // updateUserTransaction end
                                } else if (result.content[0].totalCount === 0) {
                                    userDAL.createUserTransaction(deviceId, deviceType, function (result) {
                                        if (result.status === false) {
                                            cb(result);
                                        } else {
                                            cb({
                                                status: true,
                                                "access_token": token,
                                                data: userInfo
                                            });
                                        }
                                    }); // createUserTransaction end
                                }
                            }); // checkUserTransaction end
                        }
                    }); // createAccessToken end
                }
            }); // exprieAccessToken end
        }
    });
}

/**
 * Created By: AV
 * Updated By: AV
 *
 * forgotPasswordService send OTP  user register mobile number
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var forgotPasswordService = function (request, cb) {
    debug("user.service -> forgotPasswordService");
    if (request.body.mobile === undefined || request.body.country_code === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_FORGOT_PASSWORD_REQUEST
        });
        return;
    }
    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    userDAL.checkUserIsExist(countryCode, mobile, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        } else if (result.content.length === 0) {
            cb({
                status: false,
                error: constant.userMessages.ERR_USER_NOT_EXIST
            });
            return;
        }
        sendOTP(countryCode, mobile, cb);
    });
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * resetPasswordService check first OTP is valid or not if valid than update new password
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var resetPasswordService = function (request, cb) {
    debug("user.service -> resetPasswordService");
    if (request.body.mobile === undefined || request.body.country_code === undefined ||
      request.body.otp === undefined || request.body.new_password === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_VERIFY_OTP_REQUEST
        });
        return;
    }
    var mobile = request.body.mobile;
    var countryCode = request.body.country_code;
    var OTP = request.body.otp;
    var newPassword = md5(request.body.new_password);
    verifyOTP(countryCode, mobile, OTP, function (result) {
        if (result.status === false) {
            cb(result);
        } else {
            var userId = result.data.user_id;
            var fieldValueUpdate = [];
            fieldValueUpdate.push({
                field: "password",
                fValue: newPassword
            });
            userDAL.updateUserInfoById(userId, fieldValueUpdate, function (result) {
                if (result.status === false) {
                    cb(result);
                } else {
                    cb({
                        status: true,
                        data: constant.userMessages.MSG_PASSWORD_RESET_SUCCESSFULLY
                    });
                }
            }); // updateUserInfoById end
        }
    });
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * changePasswordService check first userId and old password and after chnage password
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var changePasswordService = function (request, cb) {
    debug("user.service -> resetPasswordService");
    if (request.body.user_id === undefined || request.body.old_password === undefined || request.body.new_password === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_CHANGE_PASSWORD_REQUEST
        });
        return;
    }
    var userId = request.body.user_id;
    var oldPassword = md5(request.body.old_password);
    var newPassword = md5(request.body.new_password);
    userDAL.validateUser(userId, oldPassword, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        } else if (result.content.length === 0 || result.content[0].totalCount === 0) {
            cb({
                status: false,
                error: constant.userMessages.ERR_OLD_PASSWORD_NOT_MATCH
            });
            return;
        }
        var fieldValueUpdate = [];
        fieldValueUpdate.push({
            field: "password",
            fValue: newPassword
        });
        userDAL.updateUserInfoById(userId, fieldValueUpdate, function (result) {
            if (result.status === false) {
                cb(result);
            } else {
                cb({
                    status: true,
                    data: constant.userMessages.MSG_PASSWORD_CHANGE_SUCCESSFULLY
                });
            }
        }); // updateUserInfoById end
    }); // validateUser end
};


/**
 * Created By: AV
 * Updated By: AV
 *
 * signoutService signout to user and expire access-token and session
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var signoutService = function (request, cb) {
    debug("user.service -> signoutService");
    var deviceId = request.headers["udid"];
    var userId = request.session.userInfo.userId;
    var deviceType = request.headers["device-type"];
    userDAL.exprieAccessToken(userId, deviceId, function (result) {
        request.session.destroy();
        if (result.status === false) {
            cb({
                status: false,
                error: constant.userMessages.ERR_SIGNOUT_IS_NOT_PROPER
            });
        } else {
            var fieldValueUpdate = [];
            fieldValueUpdate.push({
                field: "isLogedIn",
                fValue: 0
            });
            userDAL.updateUserTransaction(deviceId, deviceType, fieldValueUpdate, function (result) {
                if (result.status === false) {
                    cb({
                        status: false,
                        error: constant.userMessages.ERR_SIGNOUT_IS_NOT_PROPER
                    });
                } else {
                    cb({
                        status: true,
                        data: constant.userMessages.MSG_SIGNOUT_SUCCESSFULLY
                    });
                }
            });
        }
    });
};


/**
 * Created By: AV
 * Updated By: AV
 *
 * getMyProfileService
 *
 * @param  {object}   request
 * @param  {Function} cb
 * @return {object}
 */
var getMyProfileService = function (request, cb) {
    debug("user.service -> getMyProfileService");
    if (request.session.userInfo.userId === undefined) {
        cb({
            status: false,
            error: constant.requestMessages.ERR_INVALID_GET_MY_PROFILE_REQUEST
        });
        return;
    }
    var userId = request.session.userInfo.userId;
    // Get UserINFO
    userDAL.getUserInfoById(userId, function (result) {
        if (result.status === false) {
            cb(result);
        } else if (result.content.length === 0) {
            cb({
                status: false,
                error: constant.userMessages.ERR_USER_NOT_EXIST
            });
        } else {
            var data = result.content;
            var newData = generateUserProfilePictureURL(data, request);
            cb({
                status: true,
                data: newData[0]
            });
        }
    }); // getUserInfoById end
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * sendOTP is internal function of user.service
 * this is check first OTP sending daily limit
 * after that generateOTP and save OTP in table and
 * send User register mobile mobile
 *
 * @param  {string}   countryCode
 * @param  {string}   mobile
 * @param  {Function} cb
 * @return {object}
 */
function sendOTP(countryCode, mobile, cb) {
    debug("user.service -> sendOTP");
    userDAL.checkOTPLimit(countryCode, mobile, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        } else if (result.content.length > 0 && result.content[0].totalCount >= constant.appConfig.MAX_OTP_SEND_LIMIT) {
            cb({
                status: false,
                error: constant.userMessages.ERR_OTP_LIMIT_EXCEEDED
            });
            return;
        }
        userDAL.exprieOTP(countryCode, mobile, function (result) {
            if (result.status === false) {
                cb(result);
                return;
            }
            var OTP = randomstring.generate(constant.appConfig.OTP_SETTINGS);
            var expiryDateTime = DateLibrary.getRelativeDate(new Date(), {
                operationType: "Absolute_DateTime",
                granularityType: "Seconds",
                value: constant.appConfig.MAX_OTP_EXPIRY_SECONDS
            });
            userDAL.saveOTP(countryCode, mobile, OTP, expiryDateTime, function (result) {
                if (result.status === false) {
                    cb(result);
                    return;
                } else {
                    var OTP_SENT_MSG_OBJ = common.cloneObject(constant.userMessages.MSG_OTP_SENT_SUCCEFULLY);
                    OTP_SENT_MSG_OBJ.message = OTP_SENT_MSG_OBJ.message.replace("{{mobile}}", mobile.replace(/\d(?=\d{4})/g, "*"));
                    // HACK remove below line when SMS flow implement
                    OTP_SENT_MSG_OBJ.message += (" OTP " + OTP);
                    cb({
                        status: true,
                        data: OTP_SENT_MSG_OBJ
                    });
                }
            }); // saveOTP end
        }); // exprieOTP end
    }); // checkOTPLimit end
}

/**
 * Created By: AV
 * Updated By: AV
 *
 * verifyOTP is internal function of user.service
 * this function check user enter enter OTP and mobile number is match and valid
 *
 * @param  {string}   countryCode [description]
 * @param  {string}   mobile      [description]
 * @param  {number}   OTP         [description]
 * @param  {Function} cb          [description]
 * @return {object}               [description]
 */

function verifyOTP(countryCode, mobile, OTP, cb) {
    debug("user.service -> verifyOTP");
    var currDateTime = new Date();
    userDAL.validOTP(countryCode, mobile, currDateTime, function (result) {
        if (result.status === false) {
            cb(result);
            return;
        } else if (result.content.length === 0) {
            // OTP is Expire
            cb({
                status: false,
                error: constant.userMessages.ERR_OTP_IS_EXPIRED
            });
            return;
        } else if (result.content.length > 0) {
            var OTPobj = result.content[0];
            if (OTPobj.otp != OTP) {
                // Invalid OTP
                cb({
                    status: false,
                    error: constant.userMessages.ERR_OTP_INVALID
                });
                return;
            } else if (OTPobj.otp == OTP && (OTPobj.expiry_datetime).getTime() < currDateTime.getTime()) {
                // OTP is Expire
                cb({
                    status: false,
                    error: constant.userMessages.ERR_OTP_IS_EXPIRED
                });
                return;
            }

            var filedValueUpdate = [{
                field: 'isVerified',
                fValue: 1
            }];

            userDAL.updateUserInfoByCountryCodeAndMobile(countryCode, mobile, filedValueUpdate, function (result) {
                if (result.status === false) {
                    cb(result);
                    return;
                }
                userDAL.exprieOTP(countryCode, mobile, function (result) {
                    if (result.status === false) {
                        cb(result);
                        return;
                    }
                    // Get UserINFO
                    userDAL.getUserInfoByCountryCodeAndMobile(countryCode, mobile, function (result) {
                        if (result.status === false) {
                            cb(result);
                        } else if (result.content.length === 0) {
                            cb({
                                status: false,
                                error: constant.userMessages.ERR_USER_NOT_EXIST
                            });
                        } else {
                            cb({
                                status: true,
                                data: result.content[0]
                            });
                        }
                    }); // getUserInfoByCountryCodeAndMobile end
                }); // exprieOTP end
            }); // updateUserInfoByCountryCodeAndMobile
        }
    }); // validOTP end
}

var generateUserProfilePictureURLExternal = function (datas, request) {
    debug("user.service -> generateUserProfilePictureURLExternal");
    return generateUserProfilePictureURL(datas, request);
};

function generateUserProfilePictureURL(datas, request) {
    debug("user.service -> generateUserProfilePictureURL");
    datas.forEach(function (data) {
        if (data.profile_photo === "") {
            data.profile_photo = "default.png";
        }
        var fullUrl = common.getGetMediaURL(request);
        fullUrl += '1/';
        fullUrl += data.profile_photo;
        data.profile_photo = fullUrl;

    });
    return datas;
}

module.exports = {
    signupService: signupService,
    signupServiceAdmin: signupServiceAdmin,
    resendOTPService: resendOTPService,
    verifyOTPService: verifyOTPService,
    updateProfileService: updateProfileService,
    signinService: signinService,
    signinServiceAdmin:signinServiceAdmin,
    forgotPasswordService: forgotPasswordService,
    resetPasswordService: resetPasswordService,
    changePasswordService: changePasswordService,
    signoutService: signoutService,
    getMyProfileService: getMyProfileService,
    signinWithOTPService: signinWithOTPService,
    verifyOTPNewService: verifyOTPNewService,
    generateUserProfilePictureURL: generateUserProfilePictureURLExternal
};
