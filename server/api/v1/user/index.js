var express = require('express');
var controller = require('./user.controller');
var middleware = require('../../../middleware');

var router = express.Router();
module.exports = router;


//Easy-Pay APIS
router.post('/user-signup-admin', middleware.logger, controller.signupAdmin);
router.post('/user-signin-admin', middleware.logger, controller.signinAdmin);



//router.post('/user-signup', middleware.logger, controller.signup);
router.post('/user-signin', middleware.logger, controller.signinWithOTP);
router.post('/resend-otp', middleware.logger, controller.resendOTP);
router.post('/verify-otp', middleware.logger, controller.verifyOTP);
router.put('/update-profile', middleware.checkAccessToken, middleware.logger, controller.updateProfile);
// router.post('/user-signin', middleware.logger, controller.signin);
// router.post('/forgot-password', middleware.logger, controller.forgotPassword);
// router.post('/reset-password', middleware.logger, controller.resetPassword);
// router.post('/change-password', middleware.checkAccessToken, middleware.logger, controller.changePassword);
router.post('/signout', middleware.checkAccessToken, middleware.logger, controller.signout);
router.get('/get-my-profile', middleware.checkAccessToken, middleware.logger, controller.getMyProfile);
