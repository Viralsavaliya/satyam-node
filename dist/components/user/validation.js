"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = __importDefault(require("../../utils/validate"));
const enum_1 = require("../../utils/enum");
const User = require('./userModel');
function registerValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const devices = [enum_1.Device.ANDROID, enum_1.Device.IOS, enum_1.Device.WEB];
        let validationRule;
        if (req.body.social_id) {
            validationRule = {
            // "email": "required|string|email|max:255|check_email_only:User,email",
            };
        }
        else {
            validationRule = {
                // "firstname": "required|regex:/^[a-zA-Z\s]+$/|string|min:3|max:255",
                // "lastname": "required|regex:/^[a-zA-Z\s]+$/|string|min:3|max:255",
                // "email": "required|string|email|max:255",
                "carnumber": "required|string|max:255|check_car_number:User",
                // "device": "required|in:" + devices.join(","),
                // "password": "required|min:6|max:50|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&]/",
                // "pushToken": "required",
            };
        }
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function edituserValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const devices = [enum_1.Device.ANDROID, enum_1.Device.IOS, enum_1.Device.WEB];
        let validationRule;
        if (req.body.social_id) {
            validationRule = {
                "email": "required|string|email|max:255",
            };
        }
        else {
            validationRule = {
                // "firstname": "required|regex:/^[a-zA-Z\s]+$/|string|min:3|max:255",
                // "lastname": "required|regex:/^[a-zA-Z\s]+$/|string|min:3|max:255",
                "email": "required|string|email|max:255",
                "carnumber": "required|string|max:255",
                // "device": "required|in:" + devices.join(","),
                // "password": "required|min:6|max:50|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&]/",
                // "pushToken": "required",
            };
        }
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function getForgetOTPValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "email": "required",
            "device": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function verifyOTPValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "otp": "required",
            "token": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function verifySignupOTPValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "otp": "required"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function loginValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = enum_1.UserData.EMAIL.toString();
        // const mobile = UserData.MOBILE.toString();
        let validationRule = {};
        if (req.body.social_id && req.body.login_type) {
            validationRule = {
                "username": {
                    [email]: "required|string|email|max:255",
                }
            };
        }
        else {
            // if (req.body.username[email]/*  && req.body.username[email]!="" */) {
            //     validationRule.username = {
            //         [email]: "required|string"
            //     }
            // }
            // if (req.body.username[mobile]) {
            //     validationRule.username = {
            //         [mobile]: "required|min:8|max:15"
            //     }
            // }
            validationRule.email = "required|string|email|max:255";
            validationRule.password = "required|min:4|max:50";
            validationRule.pushToken = "required";
        }
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function changePasswordValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "old_password": "required|min:6|max:50",
            "new_password": "required|min:6|max:50|different:old_password|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {
            different: "The new password must be different from old password.",
            regex: "Password must contain one uppercase ,one lowercase ,one number & one special character."
        }, req, res, next);
    });
}
function resendOTPValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            // "token": "required",
            "reason": "required"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function addPhoneValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "device": "required",
            "phone": "required|min:8|max:15",
            "country_code": "required"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
// async function tokenValidation(req: Request, res: Response, next: NextFunction) {
//     const devices = [Device.ANDROID, Device.IOS, Device.WEB];
//     const validationRule = {
//         "token": "required|string",
//     }
//     validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
// }
function forgotPasswordValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "token": "required|string",
            "password": "required|min:6|max:50|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/",
            // "confirmPassword": "required|min:4|max:50|same:password",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
// async function changeRequestValidation(req: Request, res: Response, next: NextFunction) {
//     let validationRule: any = {};
//     const user_id = req.headers.userid;
//     const { email, mobile } = req.body
//     if (email) {
//     validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
// }
function addTicketValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "subject": "required",
            "description": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function guestLoginValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "pushToken": "required"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function socialLoginValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "provider": "required",
        };
        if (req.body.provider == "facebook") {
            validationRule.access_token = "required";
        }
        if (req.body.provider == "apple" || req.body.provider == "google") {
            validationRule.auth_code = "required";
        }
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function blockUserValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "block_user_id": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
exports.default = {
    registerValidation,
    edituserValidation,
    getForgetOTPValidation,
    loginValidation,
    changePasswordValidation,
    verifyOTPValidation,
    resendOTPValidation,
    forgotPasswordValidation,
    socialLoginValidation,
    verifySignupOTPValidation,
    addPhoneValidation,
    addTicketValidation,
    guestLoginValidation,
    blockUserValidation
};
//# sourceMappingURL=validation.js.map