import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import { AdminRole, Device, Gender, ProviderType, UserData, UserType, UserTypes } from "../../utils/enum";
import { AppStrings } from "../../utils/appStrings";
import { AppConstants } from "../../utils/appConstants";
import mongoose from "mongoose";
const User = require('./userModel');

async function registerValidation(req: Request, res: Response, next: NextFunction) {
    const devices = [Device.ANDROID, Device.IOS, Device.WEB];
    let validationRule: any;
    if (req.body.social_id) {
        validationRule = {
            // "email": "required|string|email|max:255|check_email_only:User,email",
        }
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
        }
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function edituserValidation(req: Request, res: Response, next: NextFunction) {
    const devices = [Device.ANDROID, Device.IOS, Device.WEB];
    let validationRule: any;
    if (req.body.social_id) {
        validationRule = {
            "email": "required|string|email|max:255",
        }
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
        }
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function getForgetOTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "email": "required",
        "device": "required",
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function verifyOTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "otp": "required",
        "token": "required",
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function verifySignupOTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "otp": "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function loginValidation(req: Request, res: Response, next: NextFunction) {

    const email = UserData.EMAIL.toString();
    // const mobile = UserData.MOBILE.toString();

    let validationRule: any = {};
    if (req.body.social_id && req.body.login_type) {
        validationRule = {
            "username": {
                [email]: "required|string|email|max:255",
            }
        }
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
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function changePasswordValidation(req: any, res: any, next: NextFunction) {
    let validationRule: any = {
        "old_password": "required|min:6|max:50",
        "new_password": "required|min:6|max:50|different:old_password|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/"
    }
    validator.validatorUtilWithCallback(validationRule, {
        different: "The new password must be different from old password.",
        regex: "Password must contain one uppercase ,one lowercase ,one number & one special character."
    }, req, res, next);
}

async function resendOTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        // "token": "required",
        "reason": "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function addPhoneValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "device": "required",
        "phone": "required|min:8|max:15",
        "country_code": "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

// async function tokenValidation(req: Request, res: Response, next: NextFunction) {
//     const devices = [Device.ANDROID, Device.IOS, Device.WEB];
//     const validationRule = {
//         "token": "required|string",
//     }
//     validator.validatorUtilWithCallback(validationRule, {}, req, res, next);

// }

async function forgotPasswordValidation(req: Request, res: Response, next: NextFunction) {
    const validationRule = {
        "token": "required|string",
        "password": "required|min:6|max:50|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/",
        // "confirmPassword": "required|min:4|max:50|same:password",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

// async function changeRequestValidation(req: Request, res: Response, next: NextFunction) {
//     let validationRule: any = {};
//     const user_id = req.headers.userid;
//     const { email, mobile } = req.body
//     if (email) {
//     validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
// }
async function addTicketValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "subject": "required",
        "description": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function guestLoginValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "pushToken": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function socialLoginValidation(req: any, res: any, next: NextFunction) {
    let validationRule: any = {
        "provider": "required",
    }

    if (req.body.provider == "facebook") {
        validationRule.access_token = "required"
    }
    if (req.body.provider == "apple" || req.body.provider == "google") {
        validationRule.auth_code = "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function blockUserValidation(req: any, res: any, next: NextFunction) {
    let validationRule: any = {
        "block_user_id": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {
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
}