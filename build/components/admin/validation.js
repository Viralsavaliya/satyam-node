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
const commonUtils_1 = __importDefault(require("../../utils/commonUtils"));
const appStrings_1 = require("../../utils/appStrings");
function registerValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
            "email": "required|string|email|max:255|check_email:Admin,email," + req.body.email + "|exist_with_type:Admin,email," + req.body.email,
            "mobile": "required|numeric|min:8|exist_with_type:Admin,mobile," + req.body.mobile,
            "password": "required|min:6|max:50",
            // "adminrole": "required"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function addSubAdminValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
            "email": "required|string|email|max:255|check_email:Admin,email," + req.body.email + "|exist_with_type:Admin,email," + req.body.email,
            "mobile": "required|numeric|min:8|exist_with_type:Admin,mobile," + req.body.mobile,
            "adminrole": "required"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function profileValidation(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const adminId = ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.userid) || "";
        console.log(req === null || req === void 0 ? void 0 : req.body, 123456);
        const ValidationRule = {
            "name": "required|string|min:3|max:255",
            "email": "string|email|max:255|exist_value_admin:Admin,email," + adminId,
            "mobile": "numeric|min:8|exist_value_admin:Admin,mobile," + adminId,
        };
        validate_1.default.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
    });
}
function changePasswordValidation(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const adminId = ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.userid) || "";
        if (adminId === undefined)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USERID_MISSING }, 409);
        const validationRule = {
            "old_password": "required|max:50",
            "new_password": "required|min:6|max:50|different:old_password",
            "confirm_password": "required|min:6|max:50|same:new_password",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function creatework(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "description": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function updatework(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const workid = ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.id) || "";
        if (workid === undefined)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USERID_MISSING }, 409);
        const validationRule = {
        //     "humandescription": "required",
        //     "deerdescription": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function createHuntertip(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "title": "required",
            "description": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function updateHuntertip(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "title": "required",
            "description": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function createtechniques(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "title": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function updatetechniques(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "title": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function createTutorial(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        const validationRule = {
            "item": "required",
            "amount": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function userProfileValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.user_id;
        const ValidationRule = {
            "fullname": "required|regex:/[A-Za-z]/|string|min:3|max:255",
            "email": "string|email|max:255|exist_value_admin:User,email," + userId,
            "mobile": "numeric|min:8|mobile_lenght:15|exist_value_admin:User,mobile," + userId,
            "dob": "required",
            "usertype": "required",
            "country_code": "required",
            "push_token": "required"
        };
        validate_1.default.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
    });
}
function updateUserValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let ValidationRule = {
            "firstname": "required|regex:/[A-Za-z]/|string|min:3|max:255",
            "mobile": "numeric|min:8|exist_value_admin:User,mobile," + req.body.user_id
        };
        if (!req.body.email) {
            ValidationRule.mobile = "required|numeric|min:8|exist_value_admin:User,mobile," + req.body.user_id;
        }
        else {
            ValidationRule.email = "required|string|email|max:255|exist_value_admin:User,email," + req.body.user_id;
        }
        validate_1.default.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
    });
}
function updateSubAdminValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let ValidationRule = {
            "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
            "email": "required|string|email|max:255|exist_value_admin:Admin,email," + req.body.Admin_id,
            "mobile": "required|min:8|exist_value_admin:Admin,mobile," + req.body.Admin_id,
            "adminrole": "required"
        };
        validate_1.default.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
    });
}
function addVendorValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validationRule = {
            "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
            "email": "required|string|email|max:255|check_email:Vendor,email," + req.body.email + "|exist_with_type:Vendor,email," + req.body.email,
            "category_type": "required",
            "businessName": "required|string|min:3|max:255",
            "businessAddress": "required",
            "businessPhone": "required|numeric|min:8|exist_with_type:Vendor,businessPhone," + req.body.businessPhone,
            "businessEmail": "required|string|email|max:255|check_email:Vendor,businessEmail," + req.body.businessEmail + "|exist_with_type:Vendor,businessEmail," + req.body.businessEmail,
            "longitude": "required|numeric|min:-180|max:180",
            "latitude": "required|numeric|min:-90|max:90",
            "image": "required"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function updateVendorValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const vendor_id = req.params.vendor_id;
        const validationRule = {
            "name": "required|regex:/[A-Za-z]/|string|min:3|max:255",
            "email": "string|email|max:255|exist_value_admin:Vendor,email," + vendor_id,
            "category_type": "required",
            "businessName": "required|string|min:3|max:255",
            "businessAddress": "required",
            "businessPhone": "required|numeric|min:8|exist_value_admin:Vendor,businessPhone," + vendor_id,
            "businessEmail": "string|email|max:255|exist_value_admin:Vendor,businessEmail," + vendor_id,
            "longitude": "required|numeric|min:-180|max:180",
            "latitude": "required|numeric|min:-90|max:90",
            // "image" :"required"
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function OTPValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            // "otp": "required", 
            "device": "required"
        };
        if (!req.body.email) {
            validationRule.mobile = "required";
        }
        else {
            validationRule.email = "required";
        }
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function verifyOTPValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule = {
            "otp": "required"
        };
        if (!req.body.email) {
            validationRule.mobile = "required";
        }
        else {
            validationRule.email = "required";
        }
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
exports.default = {
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
};
