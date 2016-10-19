var applicationConfiguration = {
    "MAX_OTP_SEND_LIMIT": 15,
    "MAX_OTP_EXPIRY_SECONDS": 300, // 5 minute
    "OTP_SETTINGS": {
        "length": 5, // max length 10
        "charset": 'numeric'
    },
    "APPLICATION_API_KEY": "1", // 2.16 server
    // "APPLICATION_API_KEY": "cr!CkH3r0s", // amzon server
    "MAX_ACCESS_TOKEN_EXPIRY_HOURS": 720, // 30 days
    "PAGE_SIZE": 10, //
    "API_START_PATH": '/api/',
    "API_VERSION": 'v1',
    "DB_DATE_FORMAT": '%Y-%m-%d %H:%M:%S',
    "DEFAULT_MATCH_TYPE": "T20",
    "SCORING_TOKEN_SETTINGS": {
        "length": 6, // max length 45
        "charset": 'alphanumeric',
        "capitalization": 'uppercase'
    },
    "MEDIA_UPLOAD_DIR": '/home/digicorp/media/tmp/',
    "MEDIA_UPLOAD_FILE_NAME_SETTINGS": {
        "length": 12,
    },
    "MEDIA_UPLOAD_SUBFOLDERS_NAME": {
        "USER": '/user_profile/',
        "TEAM": '/team_logo/',
        "MATCH": '/match_media/'
    },
    "MEDIA_GET_STATIC_URL": '/api/v1/other/get-media/',
    "MEDIA_DEFAULT_IMAGES_PATH": '/server/images/', // path must be same level of app.js
    "MEDIA_DEFAULT_IMAGES_NAME": {
        "USER_PROFILE": 'user_profile.png',
        "TEAM_LOGO": 'teamlogo.png',
        "MATCH_MEDIA": 'images.png',
    },
    "SCORECARD_RECENT_OVERS_BALLS_TO_BE_DISPLAY": 16, // this property is use for displaying rcecent over ball limit
    "SCORECARD_COMMENTARY_BALLS_TO_BE_DISPLAY": 24, // this property is use for displaying commentary data limit
};

var requestMessages = {
    'ERR_API_KEY_NOT_FOUND': {
        code: 2001,
        message: 'api-key not found'
    },
    'ERR_INVALID_API_KEY': {
        code: 2002,
        message: 'Invalid api-key'
    },
    'ERR_UDID_NOT_FOUND': {
        code: 2003,
        message: 'UDID not found'
    },
    'ERR_DEVICE_TYPE_NOT_FOUND': {
        code: 2004,
        message: 'device-type not found'
    },
    'ERR_INVALID_SIGNUP_REQUEST': {
        code: 2005,
        message: 'Invalid signup request'
    },
    'ERR_INVALID_RESEND_OTP_REQUEST': {
        code: 2006,
        message: 'Invalid resend otp request'
    },
    'ERR_INVALID_VERIFY_OTP_REQUEST': {
        code: 2007,
        message: 'Invalid verify otp request'
    },
    'ERR_INVALID_USER_PROFILE_UPDATE_REQUEST': {
        code: 2008,
        message: 'Invalid user profile update request'
    },
    'ERR_INVALID_SIGNIN_REQUEST': {
        code: 2009,
        message: 'Invalid signin request'
    },
    'ERR_INVALID_FORGOT_PASSWORD_REQUEST': {
        code: 2010,
        message: 'Invalid forgot password request'
    },
    'ERR_INVALID_RESET_PASSWORD_REQUEST': {
        code: 2011,
        message: 'Invalid reset password request'
    },
    'ERR_INVALID_CHANGE_PASSWORD_REQUEST': {
        code: 2012,
        message: 'Invalid change password request'
    },
    'ERR_INVALID_GET_MY_PROFILE_REQUEST': {
        code: 2013,
        message: 'Invalid get my profile request'
    }
};

var userMessages = {
    'ERR_USER_IS_ALREADY_EXIST': {
        code: 17001,
        message: 'User is already exist.'
    },
    'ERR_USER_IS_NOT_ACTIVE': {
        code: 17002,
        message: 'User isn\'t active.'
    },
    'MSG_OTP_SENT_SUCCEFULLY': {
        code: 17003,
        message: 'One Time Password (OTP) has been sent to your mobile {{mobile}}, please enter the same here to signin.'
    },
    'ERR_OTP_LIMIT_EXCEEDED': {
        code: 17004,
        message: 'You have exceeded the maximum number of attempts at this time. Please wait 24 hours and try again later.'
    },
    'ERR_OTP_INVALID': {
        code: 17005,
        message: 'Invalid one time password (OTP) entered.'
    },
    'ERR_USER_NOT_EXIST': {
        code: 17006,
        message: 'User isn\'t exist.'
    },
    'ERR_OTP_IS_EXPIRED': {
        code: 17007,
        message: 'One Time Password (OTP) was expired.'
    },
    'ERR_INVALID_MOBILE_AND_PASSWORD': {
        code: 17008,
        message: 'Please enter valid mobile and password.'
    },
    'MSG_PASSWORD_CHANGE_SUCCESSFULLY': {
        code: 17009,
        message: 'Password change successfully'
    },
    'ERR_OLD_PASSWORD_NOT_MATCH': {
        code: 17010,
        message: 'Old password is not match.'
    },
    'MSG_PASSWORD_RESET_SUCCESSFULLY': {
        code: 17011,
        message: 'Password reset successfully'
    },
    'MSG_SIGNOUT_SUCCESSFULLY': {
        code: 17012,
        message: 'Signout successfully.'
    },
    'ERR_SIGNOUT_IS_NOT_PROPER': {
        code: 17013,
        message: 'Signout is not proper.'
    },
    'MSG_SIGNUP_SUCCESSFULLY': {
        code: 17014,
        message: 'Registration Successfully'
    },
    'ERR_INVALID_EMAIL_AND_PASSWORD': {
        code: 17015,
        message: 'Please enter valid email and password.'
    },
};

module.exports = {
    appConfig: applicationConfiguration,
    requestMessages: requestMessages,
    userMessages: userMessages
};
