var tbl_UserMaster = "tbl_UserMaster";
var tbl_OTP = "tbl_OTP";
var tbl_AccessToken = "tbl_AccessToken";
var tbl_UserTransaction = "tbl_UserTransaction";


var query = {
    /* check user is exist query start Easy Pay */
    checkUserIsExistAdminQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }, {
            field: 'IFNULL(name,"")',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'countryCode',
            alias: 'country_code'
        }, {
            field: 'mobile',
            alias: 'mobile'
        }, {
            field: 'isActive',
            alias: 'is_active'
        }, {
            field: 'isVerified',
            alias: 'is_verify'
        }],
        filter: {
            field: 'email',
            operator: 'EQ',
            value: ''
        }
    },

    checkUserIsExistQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }, {
            field: 'IFNULL(name,"")',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'countryCode',
            alias: 'country_code'
        }, {
            field: 'mobile',
            alias: 'mobile'
        }, {
            field: 'isActive',
            alias: 'is_active'
        }, {
            field: 'isVerified',
            alias: 'is_verify'
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }]
        }
    }, // check user is exist query end
    validateUserQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userID',
            aggregation: 'count',
            alias: 'totalCount'
        }],
        filter: {
            and: [{
                field: 'pk_userID',
                operator: 'EQ',
                value: ''
            }, {
                field: 'password',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    getUserInfoQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }, {
            field: 'countryCode',
            alias: 'country_code'
        }, {
            field: 'mobile',
            alias: 'mobile'
        }, {
            field: 'IFNULL(name,"")',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'IFNULL(email,"")',
            encloseField: false,
            alias: 'email'
        }, {
            field: 'IFNULL(DOB,"")',
            encloseField: false,
            alias: 'dob'
        }, {
            field: 'IFNULL(photo,"")',
            encloseField: false,
            alias: 'profile_photo'
        }],
        filter: {
            and: [{
                field: 'isActive',
                operator: 'EQ',
                value: 1
            }, {
                or: [{
                    and: [{
                        field: 'countryCode',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'mobile',
                        operator: 'EQ',
                        value: ''
                    }]
                }, {
                    field: 'pk_userID',
                    operator: 'EQ',
                    value: ''
                }, {
                    and: [{
                        field: 'countryCode',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'mobile',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'password',
                        operator: 'EQ',
                        value: ''
                    }]
                }]
            }]
        }
    },
    getUserInfoQueryAdmin: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }, {
            field: 'countryCode',
            alias: 'country_code'
        }, {
            field: 'mobile',
            alias: 'mobile'
        }, {
            field: 'IFNULL(name,"")',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'IFNULL(email,"")',
            encloseField: false,
            alias: 'email'
        }, {
            field: 'IFNULL(DOB,"")',
            encloseField: false,
            alias: 'dob'
        }, {
            field: 'IFNULL(photo,"")',
            encloseField: false,
            alias: 'profile_photo'
        }],
        filter: {
            and: [{
                field: 'isActive',
                operator: 'EQ',
                value: 1
            }, {
                field: 'isVerified',
                operator: 'EQ',
                value: 1
            }, {
                field: 'email',
                operator: 'EQ',
                value: ''
            },
            {
                field: 'password',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    /* create user query easy pay start */
    createUserEasyAdmin: {
        table: tbl_UserMaster,
        insert: {
            field: ["name", "email", "password", "isVerified"],
            fValue: []
        }
    }, // create user query easy pay end

    /* create user query start */
    createUserQuery: {
        table: tbl_UserMaster,
        insert: {
            field: ["mobile", "countryCode"],
            fValue: []
        }
    }, // create user query end
    updateUserQuery: {
        table: tbl_UserMaster,
        update: [],
        filter: {
            and: [{
                field: 'isActive',
                operator: 'EQ',
                value: 1
            }, {
                or: [{
                    and: [{
                        field: 'countryCode',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'mobile',
                        operator: 'EQ',
                        value: ''
                    }]
                }, {
                    field: 'pk_userID',
                    operator: 'EQ',
                    value: ''
                }]
            }]
        }
    }, // create user query end

    updateOTPQuery: {
        table: tbl_OTP,
        update: [{
            field: 'isExpired',
            fValue: 1
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'isExpired',
                operator: 'EQ',
                value: 0
            }]
        }
    },
    /* save OTP query start */
    saveOTPQuery: {
        table: tbl_OTP,
        insert: {
            field: ["countryCode", "mobile", "OTP", "expiryDateTime"],
            fValue: []
        }
    }, // save OTP query end
    checkOTPLimitQuery: {
        table: tbl_OTP,
        select: [{
            field: 'pk_otpID',
            aggregation: 'count',
            alias: 'totalCount'
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'expiryDateTime',
                operator: 'GTEQ',
                value: ''
            }, {
                field: 'expiryDateTime',
                operator: 'LTEQ',
                value: ''
            }]
        }
    },
    verifyOTPQuery: {
        table: tbl_OTP,
        select: [{
            field: 'expiryDateTime',
            alias: 'expiry_datetime'
        }, {
            field: 'OTP',
            alias: 'otp'
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'expiryDateTime',
                operator: 'GTEQ',
                value: ''
            }, {
                field: 'isExpired',
                operator: 'EQ',
                value: 0
            }]
        }
    },
    insertAccessTokenQuery: {
        table: tbl_AccessToken,
        insert: {
            field: ["fk_userID", "token", "expiryDateTime", "deviceID"],
            fValue: []
        }
    },
    updateAccessTokenQuery: {
        table: tbl_AccessToken,
        update: [{
            field: 'isExpired',
            fValue: 1
        }],
        filter: {
            or: [{
                and: [{
                    field: 'fk_userID',
                    operator: 'EQ',
                    value: ''
                }, {
                    field: 'deviceID',
                    operator: 'EQ',
                    value: ''
                }]
            }, {
                field: 'deviceID',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    insertUserTransactionQuery: {
        table: tbl_UserTransaction,
        insert: {
            field: ["deviceID", "deviceType"],
            fValue: []
        }
    },
    checkUserTransactionQuery: {
        table: tbl_UserTransaction,
        select: [{
            field: 'pk_tranID',
            aggregation: 'count',
            alias: 'totalCount'
        }],
        filter: {
            and: [{
                field: 'deviceID',
                operator: 'EQ',
                value: ''
            }, {
                field: 'deviceType',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    updateUserTransactionQuery: {
        table: tbl_UserTransaction,
        update: [{
            field: 'isLogedIn',
            fValue: 1
        }],
        filter: {
            and: [{
                field: 'deviceID',
                operator: 'EQ',
                value: ''
            }, {
                field: 'deviceType',
                operator: 'EQ',
                value: ''
            }]
        }
    },
};


module.exports = query;
