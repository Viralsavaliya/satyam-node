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
const commonUtils_1 = __importDefault(require("./commonUtils"));
const moment_1 = __importDefault(require("moment"));
const mongoose = require("mongoose");
const appConstants_1 = require("./appConstants");
const enum_1 = require("./enum");
const User = require('../components/user/userModel');
const Validator = require('validatorjs');
const validatorUtil = (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors.errors, false));
};
const validatorUtilWithCallback = (rules, customMessages, req, res, next) => {
    const validation = new Validator(req.body, rules, customMessages);
    validation.passes(() => next());
    validation.fails(() => commonUtils_1.default.sendError(req, res, {
        errors: commonUtils_1.default.formattedErrors(validation.errors.errors)
    }));
};
Validator.registerAsync('exist_value', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: value, _id: { $ne: _id } }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('exist_value_with_type', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 4)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id, 3: usertype } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: value, usertype: usertype, _id: { $ne: _id } }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('exist_value_admin', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : (column == "product_id") ? `This product already added` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: value, _id: { $ne: _id } }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('exist', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 2)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: value }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('exist_with_type', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: usertype } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : (column == "product_id") ? `This product already added` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: value, usertype: usertype }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('check_email', function (value, attribute, req, passes) {
    let email = value.toString();
    let email_string = email.substring(0, email.lastIndexOf("@"));
    let email_domain = email.substring(email_string.length + 1, email.length);
    let final_value = email_string.replaceAll('.', '', email.substring(0, email.lastIndexOf("@"))).replaceAll('+', '', email.substring(0, email.lastIndexOf("@"))) + '@' + email_domain;
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: usertype } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: final_value, usertype: usertype }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('check_email_only', function (value, attribute, req, passes) {
    let email = value.toString();
    // let email_string = email.substring(0, email.lastIndexOf("@"))
    // let email_domain = email.substring(email_string.length + 1, email.length)
    // let final_value = email_string.replaceAll('.', '', email.substring(0, email.lastIndexOf("@"))).replaceAll('+', '', email.substring(0, email.lastIndexOf("@"))) + '@' + email_domain;
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
    let attArr = attribute.split(",");
    if (attArr.length !== 2)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: email }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('check_car_number', function (value, attribute, req, passes) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(value);
        // return false;
        const lowerCaseCarNumber = value.toUpperCase();
        try {
            const user = yield User.findOne({ carnumber: lowerCaseCarNumber });
            if (!user) {
                passes();
            }
            else {
                passes(false, `The car number ${value} is already registered.`);
            }
        }
        catch (error) {
            console.error(error);
            passes(false, 'An error occurred while checking the car number.');
        }
    });
});
Validator.registerAsync('mobile_lenght', function (value, attribute, req, passes) {
    if (value.toString().length != attribute) {
        passes(false, `The ${req} must be at least ${attribute} digits.`);
    }
    else {
        passes();
    }
});
// valid_date function
Validator.registerAsync('valid_date', function (value, attribute, req, passes) {
    if ((0, moment_1.default)(value, 'YYYY-MM-DD', true).isValid()) {
        passes();
    }
    else {
        passes(false, 'Invalid date format, it should be YYYY-MM-DD');
    }
});
//must_from:table,column
Validator.registerAsync('must_from', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: must_from:table,column');
    let attArr = attribute.split(",");
    if (attArr.length < 2 || attArr.length > 3)
        throw new Error('Specify Requirements i.e fieldName: must_from:table,column');
    const { 0: table, 1: column } = attArr;
    let msg = `${column} must be from ${table}`;
    mongoose.model(table).findOne({ [column]: value }).then((result) => {
        if (result) {
            passes();
        }
        else {
            passes(false, msg);
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('validObjectId', function (value, attribute, req, passes) {
    if (value) {
        if (mongoose.Types.ObjectId.isValid(value) && typeof value === 'string') {
            passes();
        }
        else {
            passes(false, 'Invalid ObjectId');
        }
    }
});
Validator.registerAsync('date_before_today', function (value, attribute, req, passes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (value) {
            const isProvider = yield mongoose.model(appConstants_1.AppConstants.MODEL_USER).find(value).then((user) => __awaiter(this, void 0, void 0, function* () {
                if ((user === null || user === void 0 ? void 0 : user.usertype) == enum_1.UserTypes.BULK)
                    return true;
                else
                    return false;
            }));
        }
    });
});
Validator.registerAsync('date_after_today_or_same', function (value, attribute, req, passes) {
    if (value) {
        if ((0, moment_1.default)(value, 'YYYY-MM-DD').isAfter((0, moment_1.default)().format('YYYY-MM-DD'))
            || (0, moment_1.default)(value, 'YYYY-MM-DD').isSame((0, moment_1.default)().format('YYYY-MM-DD'))) {
            passes();
        }
        else {
            passes(false, `${value} must be after today`);
        }
    }
});
Validator.registerAsync('valid_time', function (value, attribute, req, passes) {
    if (value) {
        if ((0, moment_1.default)(value, 'hh:mm a', true).isValid()) {
            passes();
        }
        else {
            passes(false, 'Invalid time');
        }
    }
});
Validator.registerAsync('date_after', function (value, attribute, req, passes) {
    try {
        if (value && attribute) {
            const { 0: field, 1: date } = attribute;
            const dateAfter = (0, moment_1.default)(date, 'YYYY-MM-DD', true);
            if (Array.isArray(value)) {
                const dateArr = value.map((date) => (0, moment_1.default)(date, 'YYYY-MM-DD', true));
                const unique = value.filter((v, i, a) => a.indexOf(v) === i);
                if (unique.length !== dateArr.length) {
                    passes(false, `${field} must be unique`);
                }
                const isValid = dateArr.every((date) => date.isAfter(dateAfter));
                if (isValid) {
                    passes();
                }
                else {
                    passes(false, `${field} must be after ${date}`);
                }
            }
            else {
                const dateValue = (0, moment_1.default)(value, 'YYYY-MM-DD', true);
                if (dateValue.isAfter(dateAfter)) {
                    passes();
                }
                else {
                    passes(false, `${field} must be after ${date}`);
                }
            }
        }
    }
    catch (error) {
        passes(false, `${value} must be after ${attribute}`);
    }
});
Validator.registerAsync('date_before', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: date_before:date');
    const { 0: date, 1: format } = attribute.split(",");
    if (value) {
        if ((0, moment_1.default)(value).isBefore((0, moment_1.default)().add(-date, format))) {
            passes();
        }
        else {
            passes(false, `${value} must be before ${attribute}`);
        }
    }
});
Validator.registerAsync('validObjectId', function (value, attribute, req, passes) {
    if (value) {
        if (mongoose.Types.ObjectId.isValid(value) && typeof value === 'string') {
            passes();
        }
        else {
            passes(false, 'Invalid ObjectId');
        }
    }
});
Validator.registerAsync('validProvider', function (value, attribute, req, passes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (value && mongoose.Types.ObjectId.isValid(value)) {
            const isProvider = yield mongoose.model(appConstants_1.AppConstants.MODEL_USER).findById(value).then((user) => __awaiter(this, void 0, void 0, function* () {
                if ((user === null || user === void 0 ? void 0 : user.usertype) == enum_1.UserTypes.BULK)
                    return true;
                else
                    return false;
            }));
            if (!isProvider)
                passes(false, 'Invalid Provider');
            else
                passes();
        }
        else {
            passes(false, 'Invalid ObjectId');
        }
    });
});
Validator.registerAsync('validSeeker', function (value, attribute, req, passes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (value && mongoose.Types.ObjectId.isValid(value)) {
            const isSeeker = yield mongoose.model(appConstants_1.AppConstants.MODEL_USER).findById(value).then((user) => __awaiter(this, void 0, void 0, function* () {
                if ((user === null || user === void 0 ? void 0 : user.usertype) == enum_1.UserTypes.INDIVIDUAL)
                    return true;
                else
                    return false;
            }));
            if (!isSeeker)
                passes(false, 'Invalid Seeker');
            else
                passes();
        }
        else {
            passes(false, 'Invalid ObjectId');
        }
    });
});
Validator.registerAsync('exist_cart_product', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 5)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: product_id, 3: user_column, 4: user_id } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in cart`;
    mongoose.model(table).findOne({ [column]: mongoose.Types.ObjectId(value), user_id: mongoose.Types.ObjectId(user_id) }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('checkABN', function (value, attribute, req, passes) {
    try {
        if (!attribute)
            throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
        let attArr = attribute.split(",");
        if (attArr.length !== 3)
            throw new Error(`Invalid format for validation rule on ${attribute}`);
        let { 0: table, 1: column, 2: abn } = attArr;
        abn = abn.split(" ").join("");
        if (abn.length != 11 || isNaN(parseInt(abn)))
            throw new Error(`Please enter validat ABN!`);
        let weighting = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        let firstDigitProcessed = parseInt(abn.charAt(0)) - 1;
        let weighted = firstDigitProcessed * weighting[0];
        for (var i = 1; i < abn.length; i++) {
            weighted += (parseInt(abn.charAt(i)) * weighting[i]);
        }
        passes();
        return (weighted % 89) == 0;
    }
    catch (err) {
        passes(false, "Please enter valid ABN!");
    }
});
Validator.registerAsync('checkACN', function (value, attribute, req, passes) {
    try {
        if (!attribute)
            throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
        let attArr = attribute.split(",");
        if (attArr.length !== 3)
            throw new Error(`Invalid format for validation rule on ${attribute}`);
        let { 0: table, 1: column, 2: acn } = attArr;
        acn = acn.split(" ").join("");
        if (acn.length != 9 || isNaN(parseInt(acn)))
            throw new Error(`Please enter validat ACN!`);
        var weighting = [8, 7, 6, 5, 4, 3, 2, 1];
        var weighted = 0;
        for (var i = 0; i < weighting.length; i++) {
            weighted += (parseInt(acn.charAt(i)) * weighting[i]);
        }
        let checkDigit = 10 - (weighted % 10);
        checkDigit = checkDigit == 10 ? 0 : checkDigit;
        passes();
        return checkDigit == acn[8];
    }
    catch (err) {
        passes(false, "Please enter valid ACN!");
    }
});
Validator.registerAsync('coupon_exist', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: coupon_code } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: coupon_code }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('coupon_exist_id', function (value, attribute, req, passes) {
    // try{
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: value, _id: { $ne: _id } }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('product_stock_exist', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} stock already available`;
    mongoose.model(table).findOne({ [column]: mongoose.Types.ObjectId(value) /* , _id: { $ne: _id } */ }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('check_mobile_only', function (value, attribute, req, passes) {
    let mobile = value.toString();
    // console.log(mobile)
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');
    let attArr = attribute.split(",");
    if (attArr.length !== 2)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;
    // console.log(table)
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    // console.log(msg)
    mongoose.model(table).findOne({ [column]: mobile }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
/* Something inserted by vendor : unique for single vendor*/
Validator.registerAsync('exist_with_vendor_id', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: { $regex: value, $options: "i" }, vendor_id: mongoose.Types.ObjectId(_id) }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('exist_value_with_vendor_id', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 4)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id, 3: vendor_id } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    // console.log(table,column,vendor_id,_id,)
    mongoose.model(table).findOne({ [column]: { $regex: value, $options: "i" }, vendor_id: mongoose.Types.ObjectId(vendor_id), _id: { $ne: _id } }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('exist_value_with_vendor_category_type', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 4)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id, 3: category_type } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    mongoose.model(table).findOne({ [column]: value, category_type: category_type, _id: { $ne: _id } }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
Validator.registerAsync('exist_with_vendor_category_type', function (value, attribute, req, passes) {
    if (!attribute)
        throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 3)
        throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: category_type } = attArr;
    let msg = (column == "username") ? `${column} has already been taken ` : `${column} already in use`;
    // mongoose.model(table).findOne({ [column]: {$regex : value , $options :"i"} , category_type:category_type}).then((result: any) => {
    mongoose.model(table).findOne({ [column]: value, category_type: category_type }).then((result) => {
        if (result) {
            passes(false, msg);
        }
        else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});
exports.default = {
    validatorUtil,
    validatorUtilWithCallback
};
//# sourceMappingURL=validate.js.map