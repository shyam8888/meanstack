var debug = require('debug')('server:api:v1:user:controller');
var userService = require('./user.service');
var constant = require('../constant');


/**
 * Created By: AV
 * Updated By: AV
 *
 * Creating New User
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var signupAdmin = function (request, reposnse) {
    debug("user.controller -> signup Admin");
    if (request.body != undefined && typeof request.body === "object") {
        userService.signupServiceAdmin(request, function (result) {
            return reposnse.send(result);
        })
    }
    else {
        return reposnse.send({ status: false, error: constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST });
    }
}


var signup = function (request, response) {
    debug("user.controller -> singup");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.signupService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNUP_REQUEST
        });
    }
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * Resend OTP
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var resendOTP = function (request, response) {
    debug("user.controller -> resendOTP");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.resendOTPService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_RESEND_OTP_REQUEST
        });
    }
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * Verify OTP
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var verifyOTP = function (request, response) {
    debug("user.controller -> verifyOTP");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.verifyOTPNewService(request, function (result) {
            if (result.status === true) {
                var session = request.session;
                session.userInfo = {
                    accessToken: result['access-token'],
                    userId: result.data.user_id,
                    name: result.data.name,
                    mobile: result.data.mobile
                };
            }
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_VERIFY_OTP_REQUEST
        });
    }
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * Update User Profile
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var updateProfile = function (request, response) {
    debug("user.controller -> updateProfile");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.updateProfileService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_USER_PROFILE_UPDATE_REQUEST
        });
    }
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * User Signin
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var signin = function (request, response) {
    debug("user.controller -> signin");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.signinService(request, function (result) {
            if (result.status === true) {
                var session = request.session;
                session.userInfo = {
                    userId: result.data.user_id,
                    name: result.data.name,
                    mobile: result.data.mobile
                };
            }
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
    }
};
var signinAdmin = function (request, response) {
    debug("user.controller - > signin Admin");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.signinServiceAdmin(request, function (result) {
            if (result.status === true) {
                var session = request.session;
                session.userInfo = {
                    userId: result.data.user_id,
                    name: result.data.name,
                    mobile: result.data.mobile
                };
            }
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
    }
}

/**
 * Created By: AV
 * Updated By: AV
 *
 * User Signin
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var signinWithOTP = function (request, response) {
    debug("user.controller -> signinWithOTP");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.signinWithOTPService(request, function (result) {
            console.log("**********");
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_SIGNIN_REQUEST
        });
    }
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * Forgot Password in that send OTP on user register mobile numebr
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var forgotPassword = function (request, response) {
    debug("user.controller -> forgotPassword");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.forgotPasswordService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_FORGOT_PASSWORD_REQUEST
        });
    }
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * resetPassword in that verify OTP and update password
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var resetPassword = function (request, response) {
    debug("user.controller -> resetPassword");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.resetPasswordService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_RESET_PASSWORD_REQUEST
        });
    }
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * changePassword in that verify userId and old password & update new password
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var changePassword = function (request, response) {
    debug("user.controller -> changePassword");
    if (request.body !== undefined && typeof request.body === "object") {
        userService.changePasswordService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_CHANGE_PASSWORD_REQUEST
        });
    }
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * signout function is use for signout user into cricheroes
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var signout = function (request, response) {
    debug("user.controller -> signout");
    userService.signoutService(request, function (result) {
        return response.send(result);
    });
};

/**
 * Created By: AV
 * Updated By: AV
 *
 * signout function is use for signout user into cricheroes
 *
 * @param  {object} request
 * @param  {object} response
 * @return {object}
 */
var getMyProfile = function (request, response) {
    debug("user.controller -> getMyProfile");
    if (request.session.userInfo !== undefined) {
        userService.getMyProfileService(request, function (result) {
            return response.send(result);
        });
    } else {
        return response.send({
            status: false,
            error: constant.requestMessages.ERR_INVALID_GET_MY_PROFILE_REQUEST
        });
    }
};



module.exports = {
    signup: signup,
    signupAdmin: signupAdmin,
    resendOTP: resendOTP,
    verifyOTP: verifyOTP,
    updateProfile: updateProfile,
    signin: signin,
    signinAdmin:signinAdmin,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    changePassword: changePassword,
    signout: signout,
    getMyProfile: getMyProfile,
    signinWithOTP: signinWithOTP,
};
