import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import commonUtils from "../../utils/commonUtils";
import { Device, UserData, UserType, UserTypes } from "../../utils/enum";
import { AppStrings } from "../../utils/appStrings";
import {
    LoginRequestPayload,
    OtpRequestPayload,
    RegisterRequestPayload,
    ResetPasswordRequestPayload,
    UserTokenPayload,
    UserTokenRole
 } from "../../auth/models";

async function registerValidation(req: Request, res: Response, next: NextFunction) {

    const validationRule = {
        "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "required|string|email|max:255|check_email:Admin,email," + req.body.email + "|exist_with_type:Admin,email," + req.body.email,
        "mobile": "required|numeric|min:8|exist_with_type:Admin,mobile," + req.body.mobile,
        "password": "required|min:6|max:50",
        // "adminrole": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function addSubAdminValidation(req: Request, res: Response, next: NextFunction) {

    const validationRule = {
        "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "required|string|email|max:255|check_email:Admin,email," + req.body.email + "|exist_with_type:Admin,email," + req.body.email,
        "mobile": "required|numeric|min:8|exist_with_type:Admin,mobile," + req.body.mobile,
        "adminrole": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function profileValidation(req: Request, res: Response, next: NextFunction) {

    const adminId = req?.headers?.userid || "";
    console.log(req?.body,123456);
    
    const ValidationRule = {
        "name": "required|string|min:3|max:255",
        "email": "string|email|max:255|exist_value_admin:Admin,email," + adminId,
        "mobile": "numeric|min:8|exist_value_admin:Admin,mobile," + adminId,
    }

    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

async function changePasswordValidation(req: any, res: any, next: NextFunction) {
    const adminId = req?.headers?.userid || "";
    if (adminId === undefined)
        return commonUtils.sendError(req, res, { message: AppStrings.USERID_MISSING }, 409);

    const validationRule = {
        "old_password": "required|max:50",
        "new_password": "required|min:6|max:50|different:old_password",
        "confirm_password": "required|min:6|max:50|same:new_password",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function creatework(req: any, res: any, next: NextFunction) {


    const validationRule = {
        "description": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function updatework(req: any, res: any, next: NextFunction) {
    const workid = req?.headers?.id || "";
    if (workid === undefined)
        return commonUtils.sendError(req, res, { message: AppStrings.USERID_MISSING }, 409);

    const validationRule = {
    //     "humandescription": "required",
    //     "deerdescription": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function createHuntertip(req: any, res: any, next: NextFunction) {


    const validationRule = {
        "title": "required",
        "description": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function updateHuntertip(req: any, res: any, next: NextFunction) {


    const validationRule = {
        "title": "required",
        "description": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function createtechniques(req: any, res: any, next: NextFunction) {


    const validationRule = {
        "title": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function updatetechniques(req: any, res: any, next: NextFunction) {


    const validationRule = {
        "title": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function createTutorial(req: any, res: any, next: NextFunction) {
    console.log(req.body);
    

    const validationRule = {
        "item": "required",
        "amount": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}



async function userProfileValidation(req: Request, res: Response, next: NextFunction) {

    const userId = req.body.user_id;
    const ValidationRule = {
        "fullname": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "string|email|max:255|exist_value_admin:User,email," + userId,
        "mobile": "numeric|min:8|mobile_lenght:15|exist_value_admin:User,mobile," + userId,
        "dob": "required",
        "usertype": "required",
        "country_code": "required",
        "push_token": "required"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

async function updateUserValidation(req: Request, res: Response, next: NextFunction) {

    let ValidationRule: any = {
        "firstname": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "mobile" :"numeric|min:8|exist_value_admin:User,mobile," + req.body.user_id
    }
    if (!req.body.email) {
        ValidationRule.mobile = "required|numeric|min:8|exist_value_admin:User,mobile," + req.body.user_id;
    }
    else {

        ValidationRule.email = "required|string|email|max:255|exist_value_admin:User,email," + req.body.user_id;
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}
async function updateSubAdminValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {
        "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "required|string|email|max:255|exist_value_admin:Admin,email," + req.body.Admin_id,
        "mobile": "required|min:8|exist_value_admin:Admin,mobile," + req.body.Admin_id,
        "adminrole" :"required"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

async function addVendorValidation(req: Request, res: Response, next: NextFunction) {
    const validationRule = {
        "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "required|string|email|max:255|check_email:Vendor,email," + req.body.email + "|exist_with_type:Vendor,email," + req.body.email,
        "category_type": "required",
        "businessName": "required|string|min:3|max:255",
        "businessAddress": "required",
        "businessPhone": "required|numeric|min:8|exist_with_type:Vendor,businessPhone," + req.body.businessPhone,
        "businessEmail": "required|string|email|max:255|check_email:Vendor,businessEmail," + req.body.businessEmail + "|exist_with_type:Vendor,businessEmail," + req.body.businessEmail,
        "longitude" : "required|numeric|min:-180|max:180",
        "latitude" : "required|numeric|min:-90|max:90",
        "image" :"required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function updateVendorValidation(req: Request, res: Response, next: NextFunction) {
    const vendor_id = req.params.vendor_id;
    const validationRule = {
        "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
        "email": "string|email|max:255|exist_value_admin:Vendor,email," + vendor_id,
        "category_type": "required",
        "businessName": "required|string|min:3|max:255",
        "businessAddress": "required",
        "businessPhone": "required|numeric|min:8|exist_value_admin:Vendor,businessPhone," + vendor_id,
        "businessEmail": "string|email|max:255|exist_value_admin:Vendor,businessEmail," + vendor_id,
        "longitude" : "required|numeric|min:-180|max:180",
        "latitude" : "required|numeric|min:-90|max:90",
        // "image" :"required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function OTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        // "otp": "required", 
        "device": "required"
    }
    if (!req.body.email) {
        validationRule.mobile = "required"
    }
    else {
        validationRule.email = "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function verifyOTPValidation(req: Request, res: Response, next: NextFunction) {

    let validationRule: any = {
        "otp": "required"
    }
    if (!req.body.email) {
        validationRule.mobile = "required"
    }
    else {
        validationRule.email = "required"
    }

    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
export default {
    registerValidation,
    profileValidation,
    changePasswordValidation,
    creatework,
    updatework,
    createHuntertip,
    updateHuntertip,
    createtechniques,
    createTutorial,
    userProfileValidation,
    updateUserValidation,
    updateSubAdminValidation,
    addVendorValidation,
    updateVendorValidation,
    verifyOTPValidation,
    OTPValidation,
    addSubAdminValidation,
    updatetechniques
}