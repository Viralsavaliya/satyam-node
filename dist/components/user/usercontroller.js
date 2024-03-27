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
const appStrings_1 = require("../../utils/appStrings");
const commonUtils_1 = __importDefault(require("../../utils/commonUtils"));
const auth_1 = __importDefault(require("../../auth"));
const User = require('./userModel');
const supportTicket = require('../supportTicket/supportTicketModel');
const SupportChat = require('../supportTicket/supportChatModel');
const Aboutus = require('../aboutUs/aboutUsModel');
const BlockUser = require('../user/blockUserModel');
const Token = require('../../components/common/tokenModel');
const mongoose = require("mongoose");
// const config = require("config");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { google } = require('googleapis');
const _ = require("underscore");
const aes_1 = __importDefault(require("../../utils/aes"));
const event_1 = __importDefault(require("../../utils/event"));
const fs = require('fs');
const jwt = require('jsonwebtoken');
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(config.SENDGRID_API_KEY);
const Work = require("../admin/models/workModel");
const HunterTip = require("../admin/models/huntertipsModel");
const ContactUs = require("../contactUs/contactUsModel");
const Tutorial = require("../admin/models/tutorialsModel");
const PromoCode = require("../admin/models/promocodeModel");
const Techniques = require("../admin/models/techniquesModel");
const UserNotification = require("../notification/notificationModel");
const UserSetting = require("../userSetting/settingModel");
const FollowUnfollow = require("../follow/followModel");
const AppleAuth = require("apple-auth");
const log4js = require("log4js");
const logger = log4js.getLogger();
// const appleAuth = new AppleAuth(
//     {
//         "client_id": "com.whitetailtactical",
//         "team_id": "MP4BRQ22MX",
//         "key_id": "KN5CUTPN63",
//         "redirect_uri": "https://white.elaunchinfotech.in/auth/apple",
//         "scope": "name email"
//     },
//     fs.readFileSync("./config/AuthKey.p8").toString(), //read the key file
//     "text"
// );
function guestLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userObj = {
                pushToken: req.body.pushToken,
                user_type: "guestUser",
                device: req.body.device,
            };
            const userObject = new User(userObj);
            yield userObject.save();
            const response_ = yield auth_1.default.login(userObject._id, new Date());
            return commonUtils_1.default.sendSuccess(req, res, { message: "You have login as a guest successfully!", token: response_ }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getFacilityUniqId() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let total_facility = yield User.count();
            total_facility = total_facility + 1;
            let id = "000000";
            let generatedId = (id + total_facility).slice(-id.length);
            return resolve(generatedId);
        }));
    });
}
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let uniqeId = yield getFacilityUniqId();
        const userData = {
            name: req.body.name,
            email: req.body.email,
            carnumber: req.body.carnumber,
            // billnumber: uniqeId,
            mobile: req.body.mobile,
            mobile2: req.body.mobile2,
            model: req.body.model,
            chassisno: req.body.chassisno,
            engineno: req.body.engineno,
            address: req.body.address
        };
        try {
            // Create a new user record in the database
            const user = yield User.create(userData);
            const message = "User added successful";
            return commonUtils_1.default.sendSuccess(req, res, { user, message }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function edituser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.query.id;
        const user = yield User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        // const userData = {
        user.name = req.body.name ? req.body.name : user.name,
            user.email = req.body.email ? req.body.email : user.email,
            user.carnumber = req.body.carnumber ? req.body.carnumber : user.carnumber,
            user.mobile = req.body.mobile ? req.body.mobile : user.mobile,
            user.mobile2 = req.body.mobile2 ? req.body.mobile2 : user.mobile2;
        user.model = req.body.model ? req.body.model : user.model;
        user.chassisno = req.body.chassisno ? req.body.chassisno : user.chassisno;
        user.engineno = req.body.engineno ? req.body.engineno : user.engineno;
        user.address = req.body.address ? req.body.address : user.address;
        // };
        try {
            user.save();
            const message = "User Edit successful";
            return commonUtils_1.default.sendSuccess(req, res, { user, message }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email ? req.body.email : '';
            const password = req.body.password;
            const device = req.body.device;
            if (!email)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.EMAIL_MOBILE_REQUIRED }, 409);
            if (!device)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.DEVICE_REQUIRED }, 409);
            const user = yield User.findOne({ email: email });
            if (!user)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_CREDENTIAL_DOES_NOT_MATCH }, 409);
            if (user.is_delete_account == 1)
                return commonUtils_1.default.sendError(req, res, { message: "This account is deleted!" }, 409);
            if (user.status == 0)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_DEACTIVATE }, 409);
            user.pushToken = req.body.pushToken || null;
            user.login_type = user.login_type == null ? "normal" : user.login_type;
            yield user.save();
            // if (social_id && user.social_id == null) {
            //     user.social_id = social_id ? social_id : user.social_id;
            //     user.login_type = login_type ? login_type : user.login_type;
            //     await user.save();
            // }
            // if (social_id && (user.social_id != social_id)) {
            //     return commonUtils.sendError(req, res, { message: "sorry You are not owner of this account!" }, 409);
            // }
            if (user.status != 1)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_DEACTIVATE }, 409);
            // if (!user.is_verify) return commonUtils.sendError(req, res, { message: "verify your email befor login!" }, 409);
            // let hostname = req.headers.host;
            // query.is_verify = true;
            // const isVerified = await User.findOne(query);
            // if (!isVerified) {
            //     await SendEmailVarification(email, user.fullname, hostname);
            //     return commonUtils.sendError(req, res, { message: "User is not varified!" }, 409);
            // }
            if (password) {
                const valid_password = yield bcrypt.compare(password, user.password);
                if (!valid_password) {
                    res.clearCookie('accessToken');
                    res.clearCookie('refreshToken');
                    return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_PASSWORD }, 422);
                }
            }
            const response_ = yield auth_1.default.login(user._id, user.createdAt);
            const notificationscount = yield UserNotification.find({ receiver_id: new mongoose.Types.ObjectId(user._id), is_read: false });
            res.cookie("accessToken", response_.accessToken, { maxAge: 900000, httpOnly: true });
            res.cookie("refreshToken", response_.refreshToken, { maxAge: 900000, httpOnly: true });
            const token = { message: "You are login successfully!", accessToken: response_.accessToken, refreshToken: response_.refreshToken, tokenType: 'auth', is_register: true, notificationsCount: notificationscount.length }; // user is already reg no need to reg
            return commonUtils_1.default.sendSuccess(req, res, token, 200);
        }
        catch (err) {
            console.log(err);
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, token } = req.body;
        if (!otp)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.OTP_REQUIRED }, 409);
        const token_ = yield Token.findOne({
            otp: otp,
            token: token
        });
        if (!token_)
            return commonUtils_1.default.sendError(req, res, { message: "Incorrect OTP or Token." }, 409);
        token_.requestCount += 1;
        yield token_.updateOne({ requestCount: token_.requestCount });
        if (token_.requestCount > 3)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.OTP_REQUEST_LIMIT });
        if (token_.isVerified)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.OTP_ALREADY_VERIFIED });
        if (token_.otp != otp)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_OTP });
        token_.isVerified = true;
        yield token_.save();
        return commonUtils_1.default.sendSuccess(req, res, { token: token_.token }, 200);
    }
    catch (err) {
        console.log(err.message);
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.headers.userid;
        // let user_: any = {}
        const user = yield User.findById(user_id);
        if (!user)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_NOT_FOUND }, 409);
        let login_type;
        if (user.login_type == "normal") {
            login_type = 0;
        }
        else if (user.login_type == "google") {
            login_type = 1;
        }
        else if (user.login_type == "facebook") {
            login_type = 2;
        }
        else {
            login_type = 3;
        }
        const settingData = yield UserSetting.findOne({ user_id: new mongoose.Types.ObjectId(user_id) });
        let response = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            is_verify: user.is_verify,
            mobile: user.mobile,
            is_subscription: user.is_subscription,
            customer_id: user.customer_id,
            image: user.image,
            country_code: user.country_code,
            save_location_information: settingData ? settingData.save_location_information : false,
            share_to_media: settingData ? settingData.share_to_media : true,
            login_type: login_type,
            is_public: user.is_public,
            is_coupon: user.is_coupon
        };
        // user_ = {...user };
        // user_._doc.coupon = user.is_coupon === 0 ? false : true;
        // delete user_._doc.is_coupon;
        return commonUtils_1.default.sendSuccess(req, res, response, 200);
    }
    catch (err) {
        console.log(err.message);
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    try {
        const token_ = yield Token.findOne({ token: token, isVerified: true });
        if (!token_)
            return commonUtils_1.default.sendError(req, res, { message: "Token is invalid." }, 409);
        const UserExist = yield User.findOne({ _id: token_.userId });
        if (!UserExist)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_NOT_FOUND }, 409);
        const salt = yield bcrypt.genSalt(10);
        let hash_password = yield bcrypt.hash(password, salt);
        // console.log(hash_password)
        // await UserExist.save();
        let up = yield User.updateOne({ _id: token_.userId }, { $set: { password: hash_password } });
        // console.log(up)
        yield Token.deleteOne({ token: token });
        return commonUtils_1.default.sendSuccess(req, res, { message: "password changed!" }, 200);
    }
    catch (err) {
        console.log(err);
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
    // get email and send an otp to that email to confrim the user
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.headers.userid;
        const { old_password, new_password } = req.body;
        const user = yield User.findById(user_id);
        if (!user)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_NOT_FOUND }, 409);
        const valid_password = yield bcrypt.compare(old_password, user.password);
        if (!valid_password) {
            return commonUtils_1.default.sendError(req, res, { message: "Your current password is invalid!" }, 422);
        }
        const salt = yield bcrypt.genSalt(10);
        user.password = yield bcrypt.hash(new_password, salt);
        yield user.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: appStrings_1.AppStrings.PASSWORD_CHANGED }, 200);
    }
    catch (err) {
        console.log(err.message);
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const updateprofile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.headers.userid;
        if (!user_id) {
            return commonUtils_1.default.sendError(req, res, { message: "please login before update profile!" }, 409);
        }
        const { firstname, lastname, image } = req.body;
        const user = yield User.findOne({ _id: user_id });
        if (!user)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_NOT_FOUND }, 409);
        if (user.image != image) {
            if (fs.existsSync("uploads/users/" + user.image) && user.image != "") {
                fs.unlinkSync("uploads/users/" + user.image);
            }
        }
        user.firstname = firstname ? firstname : user.firstname;
        user.lastname = lastname ? lastname : user.lastname;
        user.image = image ? image : (user.image ? user.image : 'null');
        yield user.save();
        const user_ = yield User.findById(user._id);
        let login_type;
        if (user.login_type == "normal") {
            login_type = 0;
        }
        else if (user.login_type == "google") {
            login_type = 1;
        }
        else if (user.login_type == "facebook") {
            login_type = 2;
        }
        else {
            login_type = 3;
        }
        let response = {
            _id: user_._id,
            firstname: user_.firstname,
            lastname: user_.lastname,
            email: user_.email,
            is_verify: user_.is_verify,
            mobile: user_.mobile,
            is_subscription: user_.is_subscription,
            customer_id: user_.customer_id,
            image: user_.image,
            country_code: user_.country_code,
            login_type: login_type
        };
        return commonUtils_1.default.sendSuccess(req, res, response, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
function signupVerifyOtp(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { otp } = req.body;
            let tokens_ = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')) !== null && _c !== void 0 ? _c : [];
            if (tokens_.length <= 1) {
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_TOKEN }, 409);
            }
            const token = tokens_[1];
            yield new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log('signupVerifyOtp-err', err);
                        if (err.name == "TokenExpiredError") {
                            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.TOKEN_EXPIRED }, 409);
                            // reject(AppStrings.TOKEN_EXPIRED);
                        }
                        else {
                            // reject(AppStrings.INVALID_SESSION);
                            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_SESSION }, 409);
                        }
                    }
                    else {
                        let midLayer = aes_1.default.decrypt(user.sub, process.env.OUTER_KEY_PAYLOAD);
                        const userData = JSON.parse(aes_1.default.decrypt(midLayer.toString(), process.env.OUTER_KEY_USER));
                        if ((userData === null || userData === void 0 ? void 0 : userData.otp) != otp)
                            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_OTP }, 409);
                        let userObj = {
                            firstname: userData === null || userData === void 0 ? void 0 : userData.userData.firstname,
                            lastname: userData === null || userData === void 0 ? void 0 : userData.userData.lastname,
                            email: userData === null || userData === void 0 ? void 0 : userData.userData.email,
                            password: userData === null || userData === void 0 ? void 0 : userData.userData.password,
                            is_verify: true,
                            device: userData === null || userData === void 0 ? void 0 : userData.userData.device,
                            pushToken: userData === null || userData === void 0 ? void 0 : userData.userData.pushToken,
                            image: userData === null || userData === void 0 ? void 0 : userData.userData.image,
                            login_type: userData === null || userData === void 0 ? void 0 : userData.userData.login_type,
                        };
                        // console.log({userObj})
                        const userObject = new User(userObj);
                        yield userObject.save();
                        const response_ = yield auth_1.default.login(userObject._id, new Date());
                        res.cookie("accessToken", response_.accessToken, { maxAge: 900000, httpOnly: true });
                        res.cookie("refreshToken", response_.refreshToken, { maxAge: 900000, httpOnly: true });
                        return commonUtils_1.default.sendSuccess(req, res, { accessToken: response_.accessToken, refreshToken: response_.refreshToken }, 200);
                    }
                }));
            }).then((userObj) => {
                req.headers.userid = userObj.userid;
                req.headers.usertype = userObj.usertype;
                //next();
            }).catch((err) => {
                return commonUtils_1.default.sendError(req, res, { message: err }, 401);
            });
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
const sendVerifyEmail = (username, userId, credential, device, median, host, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!otp) {
            // otp = Number((Math.random() * (9999 - 1000) + 1000).toFixed());
            otp = 1111;
        }
        if (median == "email") {
            event_1.default.emit("send_register_otp", {
                to: credential,
                username: username,
                subject: "Register Verification",
                otp: otp,
                host: host
            });
        }
        else {
            return [null, 'not valid type'];
        }
    }
    catch (err) {
        console.log("send verify otp : ", err);
    }
});
function generateUniqueToken(token_) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = token_;
        let count = 0;
        while (true) {
            const token_ = yield Token.findOne({ token: token });
            if (!token_)
                break;
            count += 1;
            token = token_ + count;
        }
        return token;
    });
}
function getOTP(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, device } = req.body;
            let host = req.headers.host;
            // let otp = Number((Math.random() * (9999 - 1000) + 1000).toFixed());
            let otp = 1111;
            const user = yield User.findOne({ email: email });
            // console.log(user);
            if (!user)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_NOT_FOUND });
            if (email) {
                yield sendVerifyOTP(user.firstname + " " + user.lastname, user._id, email, device, "forForgetPassword", "Password Reset OTP Verification", host, otp, "Dear Customer, Your Binox-Bargains forgot password verification otp is " + otp + ". Please do not share the otp or your email with anyone including Binox-Bargains personnel. rIexFW47bOh");
            }
            let resetToken = crypto.randomBytes(64).toString("hex");
            resetToken = yield generateUniqueToken(resetToken);
            const hash_ = yield bcrypt.hash(resetToken, Number(10));
            yield Token.deleteOne({ userId: new mongoose.Types.ObjectId(user._id) });
            var d = new Date();
            d.setSeconds(d.getSeconds() + 120);
            const tokenData = new Token({
                userId: new mongoose.Types.ObjectId(user._id),
                otp: otp,
                token: hash_,
                device: device,
                end_time: d,
                reason: "forForgetPassword"
            });
            yield tokenData.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "check your email for otp.", token: tokenData.token });
        }
        catch (err) {
            return commonUtils_1.default.sendSuccess(req, res, { message: err.message });
        }
    });
}
const sendVerifyOTP = (username, userId, credential, device, reason, subject, host, otp, content, generateToken = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!otp) {
            otp = 1111;
            // otp = Number((Math.random() * (9999 - 1000) + 1000).toFixed());
        }
        event_1.default.emit("send_email_otp", {
            username: username,
            to: credential,
            subject: subject,
            data: {
                otp: otp,
                content: content,
                message: "Your email has been verified!"
            },
            sender: process.env.MAIL_SENDER_NO_REPLY,
            host: host
        });
        if (generateToken) {
            let resetToken = crypto.randomBytes(64).toString("hex");
            resetToken = yield generateUniqueToken(resetToken);
            const hash_ = yield bcrypt.hash(resetToken, 10);
            yield Token.deleteOne({ userId });
            var d = new Date();
            d.setSeconds(d.getSeconds() + 120);
            const tokenData = new Token({
                userId: userId,
                otp: otp,
                token: hash_,
                device: device,
                end_time: d,
                reason: reason ? reason : "forSignUp"
            });
            yield tokenData.save();
        }
    }
    catch (err) {
        console.log("send verify otp : ", err);
    }
});
function resend(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // let otp = Number((Math.random() * (9999 - 1000) + 1000).toFixed());
            let otp = 1111;
            const { token, reason } = req.body;
            if (!['forSignUp', 'forForgetPassword'].includes(reason))
                return commonUtils_1.default.sendError(req, res, { message: "reason is invalid." }, 409);
            if (reason == "forSignUp") {
                return yield getJWTOken(req, res, otp);
            }
            if (reason === "forForgetPassword" && token == null) {
                return commonUtils_1.default.sendError(req, res, { message: "Token is required!" }, 409);
            }
            let host = req.headers.host;
            let token_ = yield Token.findOne({ token: token });
            if (!token_)
                return commonUtils_1.default.sendError(req, res, { message: "Token is Invalid" }, 409);
            token_.otp = otp;
            yield token_.save();
            const user = yield User.findOne({ _id: token_.userId });
            if (!user)
                return commonUtils_1.default.sendError(req, res, { message: "user not exist!" }, 409);
            const device = user.device;
            if (reason == "forForgetPassword") {
                yield sendVerifyOTP(user.firstname + " " + user.lastname, user._id, user.email, device, "forForgetPassword", "Password Reset OTP Verification", host, otp, "Dear Customer, Your Binox-Bargains forgot password verification otp is " + otp + ". Please do not share the otp or your email with anyone including Binox-Bargains personnel. rIexFW47bOh");
                return commonUtils_1.default.sendSuccess(req, res, { message: "check your email for otp.", token: token_.token });
            }
            else {
                return commonUtils_1.default.sendError(req, res, { message: "Invalid reason" }, 409);
            }
        }
        catch (err) {
            console.log(err);
            return commonUtils_1.default.sendSuccess(req, res, { message: err.message }, 409);
        }
    });
}
function getJWTOken(req, res, otp) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let tokens_ = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')) !== null && _c !== void 0 ? _c : [];
        // console.log(tokens_)
        if (tokens_.length <= 1) {
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_TOKEN }, 409);
        }
        const token = tokens_[1];
        yield new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log('err', err);
                    if (err.name == "TokenExpiredError") {
                        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.TOKEN_EXPIRED }, 409);
                    }
                    else {
                        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_SESSION }, 409);
                    }
                }
                else {
                    let midLayer = aes_1.default.decrypt(user.sub, process.env.OUTER_KEY_PAYLOAD);
                    const userData = JSON.parse(aes_1.default.decrypt(midLayer.toString(), process.env.OUTER_KEY_USER));
                    // let tokens: [] = await redisClient.lrange(midLayer.toString(), 0, -1)
                    // let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token.toString())
                    // remove the refresh token
                    // await redisClient.lrem(midLayer.toString(), 1, await redisClient.lindex(midLayer.toString(), index));
                    // blacklist current access token
                    // await redisClient.lpush('BL_' + midLayer.toString(), token);
                    userData.otp = otp;
                    // console.log(userData);
                    const userDataObj = userData.userData;
                    const response_ = yield auth_1.default.register(userDataObj, "user", otp);
                    // console.log(userDataObj)
                    let host = req.headers.host;
                    yield sendVerifyEmail(userDataObj.firstname, userDataObj._id, userDataObj.email, userDataObj.device, "email", host, otp);
                    return commonUtils_1.default.sendSuccess(req, res, { token: response_ === null || response_ === void 0 ? void 0 : response_.accessToken }, 200);
                }
            }));
        }).then((userObj) => {
            req.headers.userid = userObj.userid;
            req.headers.usertype = userObj.usertype;
            //next();
        }).catch((err) => {
            return commonUtils_1.default.sendError(req, res, { message: err }, 401);
        });
    });
}
function addPhone(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // let otp = Number((Math.random() * (9999 - 1000) + 1000).toFixed());
            let otp = 1111;
            const { country_code, phone, device } = req.body;
            const user = yield User.findById(req.headers.userid);
            user.mobile = phone;
            user.country_code = country_code;
            yield user.save();
            // await Token.deleteOne({ userId: new mongoose.Types.ObjectId(user._id) });
            // var d = new Date();
            // d.setSeconds(d.getSeconds() + 120);
            // const tokenData = new Token({
            //     userId: new mongoose.Types.ObjectId(user._id),
            //     otp: otp,
            //     device: device,
            //     end_time: d,
            //     phone: phone,
            //     country_code: country_code
            // });
            // eventEmitter.emit("send_mobile_otp", { subject: "subject", from: "whiteTail", to: phone })
            // await tokenData.save();
            // return commonUtils.sendSuccess(req, res, { message: "Please check your mobile for otp.", token: tokenData.token, otp: otp });
            return commonUtils_1.default.sendSuccess(req, res, { message: "Phone number add successfully" });
        }
        catch (err) {
            console.log(err);
            return commonUtils_1.default.sendSuccess(req, res, { message: err.message }, 409);
        }
    });
}
function resendPhone(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // let otp = Number((Math.random() * (9999 - 1000) + 1000).toFixed());
            let otp = 1111;
            // const { country_code, phone, device } = req.body;
            const userid = req.headers.userid;
            var d = new Date();
            const token = yield Token.findOne({ userId: new mongoose.Types.ObjectId(userid) });
            if (!token)
                return commonUtils_1.default.sendError(req, res, { message: "Please try again to add number. " }, 409);
            d.setSeconds(d.getSeconds() + 120);
            token.otp = otp;
            token.end_time = d;
            yield token.save();
            // eventEmitter.emit("send_mobile_otp", { subject: "subject", from: "whiteTail", to: phone })
            return commonUtils_1.default.sendSuccess(req, res, { message: "Please check your mobile for otp.", otp: otp });
        }
        catch (err) {
            console.log(err);
            return commonUtils_1.default.sendSuccess(req, res, { message: err.message }, 409);
        }
    });
}
function verifyMobileOtp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { otp } = req.body;
            if (!otp)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.OTP_REQUIRED }, 409);
            const token_ = yield Token.findOne({
                otp: otp,
                userId: mongoose.Types.ObjectId(req.headers.userid)
            });
            if (!token_)
                return commonUtils_1.default.sendError(req, res, { message: "Incorrect OTP." }, 409);
            token_.requestCount += 1;
            yield token_.updateOne({ requestCount: token_.requestCount });
            if (token_.requestCount > 3)
                return commonUtils_1.default.sendError(req, res, { message: "OTP request limit reached." });
            if (token_.isVerified)
                return commonUtils_1.default.sendError(req, res, { message: "OTP already verified." });
            if (token_.otp != otp)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_OTP });
            const user = yield User.findOne({ _id: token_.userId });
            user.mobile = token_.phone;
            user.country_code = token_.country_code;
            yield user.save();
            token_.isVerified = true;
            token_.phone = null;
            token_.country_code = null;
            yield token_.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Phone number add successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendSuccess(req, res, { message: err.message }, 409);
        }
    });
}
function sendSupportTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { subject, description, files } = req.body;
            const user = yield User.findOne({ _id: req.headers.userid });
            if (!user)
                return commonUtils_1.default.sendError(req, res, "User not found", 409);
            const ticket = new supportTicket();
            ticket.user_id = user._id;
            ticket.email = user.email;
            ticket.subject = subject;
            ticket.description = description;
            ticket.files = files;
            yield ticket.save();
            if (files && files.length > 0) {
                files.map((f) => __awaiter(this, void 0, void 0, function* () {
                    const msg = new SupportChat();
                    msg.support_ticket_id = ticket._id;
                    msg.sender_id = 2;
                    msg.message = f;
                    msg.type = 2;
                    yield msg.save();
                }));
            }
            const msg = new SupportChat();
            msg.support_ticket_id = ticket._id;
            msg.sender_id = 2;
            msg.message = description;
            msg.type = 1;
            yield msg.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Ticket Add Successfully" }, 200);
        }
        catch (err) {
            console.log(err);
            return commonUtils_1.default.sendSuccess(req, res, { message: err.message }, 409);
        }
    });
}
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { message, support_ticket_id, type } = req.body;
            const ticket = new SupportChat();
            ticket.support_ticket_id = support_ticket_id;
            ticket.sender_id = 2;
            ticket.message = message;
            ticket.type = type;
            yield ticket.save();
            return commonUtils_1.default.sendSuccess(req, res, {}, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
// async function socialLogin(req: Request, res: Response) {
//     try {
//         const { provider, auth_code, access_token } = req.body;
//         let user
//         // switch (provider) {
//         //     case "google":
//         //         if (!auth_code) return commonUtils.sendError(req, res, { message: "Invalid authorization code provided." }, 409);
//         //         const oauth2Client = new google.auth.OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET);
//         //         let { tokens } = await oauth2Client.getToken(auth_code);
//         //         oauth2Client.setCredentials({ access_token: tokens.access_token });
//         //         let oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
//         //         let googleResponse = await oauth2.userinfo.get();    // get user info
//         //         user = await findUserForSocialLogin(googleResponse.data.email, googleResponse.data.id, provider)
//         //         if (user) {
//         //             user.device = req.body.device;
//         //             user.pushToken = req.body.pushToken;
//         //             await user.save();
//         //         }
//         //         if (!user) {
//         //             // const customer = await createStripeCustomer(googleResponse.data.email);
//         //             let user_data: any = {
//         //                 firstname: googleResponse.data.given_name,
//         //                 lastname: googleResponse.data.family_name,
//         //                 email: googleResponse.data.email,
//         //                 device: req.body.device,
//         //                 pushToken: req.body.pushToken,
//         //                 google_id: googleResponse.data.id,
//         //                 login_type: provider,
//         //                 is_verify: true,
//         //             }
//         //             user = new User(user_data);
//         //             await user.save();
//         //         }
//         //         break;
//         //     case "facebook":
//         //         if (!access_token) return commonUtils.sendError(req, res, { message: AppStrings.INVALID_TOKEN }, 409);
//         //         const facebookResponse = await axios.get("https://graph.facebook.com/v15.0/me", {
//         //             params: {
//         //                 fields: ['id', 'email', 'name', 'first_name', 'last_name'].join(','),
//         //                 access_token: access_token,
//         //             },
//         //         })
//         //         user = await findUserForSocialLogin(facebookResponse.data.email, facebookResponse.data.id, provider)
//         //         if (user) {
//         //             user.device = req.body.device;
//         //             user.pushToken = req.body.pushToken;
//         //             await user.save();
//         //         }
//         //         if (!user) {
//         //             // const customer = await createStripeCustomer(facebookResponse.data.email);
//         //             let user_data: any = {
//         //                 firstname: facebookResponse.data.first_name,
//         //                 lastname: facebookResponse.data.last_name,
//         //                 email: facebookResponse.data.email,
//         //                 device: req.body.device,
//         //                 pushToken: req.body.pushToken,
//         //                 facebook_id: facebookResponse.data.id,
//         //                 login_type: provider,
//         //                 is_verify: true,
//         //                 // customer_id: customer.id
//         //             }
//         //             user = new User(user_data);
//         //             await user.save();
//         //         }
//         //         break
//         //     case "apple":
//         //         if (!auth_code) return commonUtils.sendError(req, res, { message: "Invalid authorization code provided." }, 409);
//         //         const appleResponse = await appleAuth.accessToken(auth_code);
//         //         const idToken = jwt.decode(appleResponse.id_token);
//         //         const socialId = idToken.sub;
//         //         const email = idToken.email;
//         //         if (!email) {
//         //             return commonUtils.sendError(req, res, { message: "Please ensure to share your email while using apple login.", }, 409);
//         //         }
//         //         user = await findUserForSocialLogin(email, socialId, provider)
//         //         if (user) {
//         //             user.device = req.body.device;
//         //             user.pushToken = req.body.pushToken;
//         //             await user.save();
//         //         }
//         //         if (!user) {
//         //             // let customer = await createStripeCustomer(email)
//         //             let user_data: any = {
//         //                 firstname: req.body.firstname,
//         //                 lastname: req.body.lastname,
//         //                 email: email,
//         //                 device: req.body.device,
//         //                 pushToken: req.body.pushToken,
//         //                 apple_id: socialId,
//         //                 login_type: provider,
//         //                 is_verify: true,
//         //                 // customer_id: customer.id
//         //             }
//         //             user = new User(user_data);
//         //             await user.save();
//         //         }
//         //         break;
//         // }
//         if (user) {
//             const response_ = await Auth.login(user._id, user.createdAt);
//             res.cookie("accessToken", response_.accessToken, { maxAge: 900000, httpOnly: true });
//             res.cookie("refreshToken", response_.refreshToken, { maxAge: 900000, httpOnly: true });
//             const token = { accessToken: response_.accessToken, refreshToken: response_.refreshToken, tokenType: 'auth', is_register: true };// user is already reg no need to reg
//             return commonUtils.sendSuccess(req, res, token, 200);
//         } else {
//             return commonUtils.sendError(req, res, { message: "Unable to perform social login!" }, 409);
//         }
//     } catch (err: any) {
//         console.log(err)
//         return commonUtils.sendError(req, res, { message: err.message }, 409);
//     }
// }
const findUserForSocialLogin = (email, socialId, provider) => __awaiter(void 0, void 0, void 0, function* () {
    let user = undefined;
    if (email) {
        user = yield User.findOne({ email: email.toLowerCase() });
        if (user) {
            switch (provider) {
                case "google":
                    user.google_id = socialId;
                    user.login_type = "google";
                    break;
                case "apple":
                    user.apple_id = socialId;
                    user.login_type = "apple";
                    break;
                case "facebook":
                    user.facebook_id = socialId;
                    user.login_type = "facebook";
                    break;
            }
            yield user.save();
        }
    }
    if (!user) {
        switch (provider) {
            case "google":
                user = yield User.findOne({ google_id: socialId });
                break;
            case "apple":
                user = yield User.findOne({ apple_id: socialId });
                break;
            case "facebook":
                user = yield User.findOne({ facebook_id: socialId });
                break;
        }
    }
    return user;
});
const WorkList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Work.find().skip(1);
        const getFirstRecord = yield Work.findOne();
        let response = {
            humanImage: getFirstRecord.humanimage,
            deerImage: getFirstRecord.deerimage,
            workList: user[0].description
        };
        return commonUtils_1.default.sendSuccess(req, res, response);
    }
    catch (err) {
        return commonUtils_1.default.sendSuccess(req, res, { message: err.message }, 409);
    }
});
const HunterTipList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const posts = yield HunterTip.aggregate([
            {
                $match: {
                    status: 1,
                },
            },
            {
                $lookup: {
                    from: "admins",
                    localField: "adminId",
                    foreignField: "_id",
                    as: "adminData",
                },
            },
            { $unwind: { path: "$adminData", preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    createdAt: 1,
                    type: 1,
                    total: 1,
                    image: 1
                },
            },
        ]);
        const notificationscount = yield UserNotification.find({ receiver_id: new mongoose.Types.ObjectId(req.headers.userid), is_read: false });
        return commonUtils_1.default.sendSuccess(req, res, { posts, notificationscount: notificationscount.length }, 200);
    }
    catch (err) {
        console.log(err);
        return commonUtils_1.default.sendSuccess(req, res, { message: err.message }, 409);
    }
});
const getAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const about = yield Aboutus.find({ status: 1 }).select("_id answer question createdAt");
        return commonUtils_1.default.sendSuccess(req, res, about);
    }
    catch (err) {
        console.log(err);
        return commonUtils_1.default.sendSuccess(req, res, { message: err.message }, 409);
    }
});
function getContactUs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contact = yield ContactUs.find().select("_id name mailAddress email phone");
            return commonUtils_1.default.sendSuccess(req, res, contact[0], 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getTutorial(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;
            const posts = yield Tutorial.aggregate([
                {
                    $match: {
                        status: 1,
                    },
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        link: 1,
                        createdAt: 1,
                        type: 1,
                        total: 1,
                    },
                },
            ]);
            return commonUtils_1.default.sendSuccess(req, res, posts, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
;
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;
            const chats = yield SupportChat.aggregate([
                {
                    $match: {
                        support_ticket_id: new mongoose.Types.ObjectId(req.query.support_id),
                    },
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        message: 1,
                        type: 1,
                        sender_id: 1,
                        createdAt: 1,
                        support_ticket_id: 1,
                    },
                },
            ]);
            return commonUtils_1.default.sendSuccess(req, res, chats, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
;
function getSupportTickets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;
            const tickets = yield supportTicket.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(req.headers.userid),
                    },
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        subject: 1,
                        description: 1,
                        files: 1,
                        createdAt: 1,
                        status: 1,
                        user_id: 1,
                    },
                },
            ]);
            return commonUtils_1.default.sendSuccess(req, res, tickets, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
;
function notificationList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // try {
        //     let user_id = req.headers.userid;
        //     let { page }: any = req.query;
        //     page = page || 1;
        //     const limit = parseInt(req.query.limit as string) || 10;
        //     const skip = (page - 1) * limit;
        //     const notifications = await UserNotification.aggregate([
        //         { $sort: { createdAt: -1 } },
        //         { $match: { receiver_id: new mongoose.Types.ObjectId(user_id), is_delete: 0 } },
        //         {
        //             $lookup: {
        //                 from: 'users',
        //                 localField: 'sender_id',
        //                 foreignField: '_id',
        //                 as: 'user'
        //             },
        //         },
        //         {
        //             $lookup: {
        //                 from: 'posts',
        //                 let: { postId: { $toObjectId: '$data.id' } },
        //                 pipeline: [
        //                     {
        //                         $match: {
        //                             $expr: { $eq: ['$_id', '$$postId'] }
        //                         }
        //                     }
        //                 ],
        //                 as: 'post_user'
        //             }
        //         },
        //         {
        //             $lookup: {
        //                 from: 'usersubscriptions',
        //                 let: { subscriptionId: { $toObjectId: '$data.subscription_id' } },
        //                 pipeline: [
        //                     {
        //                         $match: {
        //                             $expr: { $eq: ['$_id', '$$subscriptionId'] }
        //                         }
        //                     }
        //                 ],
        //                 as: 'subscription_data'
        //             }
        //         },
        //         {
        //             $lookup: {
        //                 from: 'users',
        //                 localField: 'post_user.user_id',
        //                 foreignField: '_id',
        //                 as: 'post_user_image'
        //             },
        //         },
        //         { $skip: skip },
        //         { $limit: limit },
        //         { $sort: { createdAt: -1 } },
        //         {
        //             $unwind: {
        //                 path: "$user",
        //                 preserveNullAndEmptyArrays: true,
        //             },
        //         },
        //         {
        //             $unwind: {
        //                 path: "$post_user",
        //                 preserveNullAndEmptyArrays: true,
        //             },
        //         },
        //         {
        //             $unwind: {
        //                 path: "$post_user_image",
        //                 preserveNullAndEmptyArrays: true,
        //             },
        //         },
        //         {
        //             $unwind: {
        //                 path: "$subscription_data",
        //                 preserveNullAndEmptyArrays: true,
        //             },
        //         },
        //         {
        //             $project: {
        //                 _id: 1,
        //                 message: 1,
        //                 title: 1,
        //                 is_read: 1,
        //                 type: 1,
        //                 is_admin: 1,
        //                 createdAt: 1,
        //                 post_id: {
        //                     $switch: {
        //                         branches: [
        //                             {
        //                                 case: { $eq: ["$type", 6] },
        //                                 then: "$data.post_id"
        //                             },
        //                             {
        //                                 case: { $eq: ["$type", 2] },
        //                                 then: "$data.id"
        //                             }
        //                         ],
        //                         default: null
        //                     }
        //                 },
        //                 sender_id: {
        //                     $switch: {
        //                         branches: [
        //                             {
        //                                 case: { $eq: ["$type", 6] },
        //                                 then: "$data.id"
        //                             },
        //                             {
        //                                 case: { $eq: ["$type", 1] },
        //                                 then: "$data.id"
        //                             }
        //                         ],
        //                         default: null
        //                     }
        //                 },
        //                 user_image: {
        //                     $switch: {
        //                         branches: [
        //                             {
        //                                 case: { $eq: ["$type", 1] },
        //                                 then: "$user.image"
        //                             },
        //                             {
        //                                 case: { $eq: ["$type", 2] },
        //                                 then: "$post_user_image.image"
        //                             },
        //                             {
        //                                 case: { $eq: ["$type", 6] },
        //                                 then: "$user.image"
        //                             }
        //                         ],
        //                         default: null
        //                     }
        //                 },
        //                 subscription_id: {
        //                     $cond: {
        //                         if: { $eq: ["$type", 3] },
        //                         then: "$data.subscription_id",
        //                         else: null
        //                     }
        //                 },
        //                 payment_status: {
        //                     $cond: {
        //                         if: { $eq: ["$type", 3] },
        //                         then: "$subscription_data.payment_status",
        //                         else: null
        //                     }
        //                 },
        //                 ticket_id: {
        //                     $cond: {
        //                         if: { $eq: ["$type", 4] },
        //                         then: "$data.id",
        //                         else: null
        //                     }
        //                 },
        //                 ticket_status: {
        //                     $cond: {
        //                         if: { $eq: ["$type", 4] },
        //                         then: "$data.status",
        //                         else: null
        //                     }
        //                 }
        //             }
        //         }
        //     ])
        //     const user = await User.findOne({ _id: user_id })
        //     const adminnotifications = await UserNotification.find({ is_admin: true });
        //     const filteredNotifications = [];
        //     for (let notification of adminnotifications) {
        //         if (notification.createdAt > user.createdAt) {
        //             filteredNotifications.push(notification);
        //         }
        //     }
        //     const mergedNotifications = [...notifications, ...filteredNotifications];
        //     mergedNotifications.sort((a, b) => b.createdAt - a.createdAt);
        //     return commonUtils.sendSuccess(req, res, mergedNotifications, 200);
        // }
        // catch (err: any) {
        //     console.log(err)
        //     return commonUtils.sendError(req, res, { message: err.message }, 409);
        // }
    });
}
function readNoti(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user_id = req.headers.userid;
            const findNoti = yield UserNotification.find({ receiver_id: new mongoose.Types.ObjectId(user_id), is_read: false });
            yield Promise.all(findNoti.map((data) => __awaiter(this, void 0, void 0, function* () {
                data.is_read = true;
                data.save();
            })));
            return commonUtils_1.default.sendSuccess(req, res, { message: "All notification readed!" }, 200);
        }
        catch (err) {
            console.log(err);
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
const promoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promocode = yield PromoCode.find().select("_id promo_code status createdAt").sort({ createdAt: "desc" });
        let findUser = yield User.findOne({ _id: new mongoose.Types.ObjectId(req.headers.userid) });
        if (!findUser)
            return commonUtils_1.default.sendError(req, res, { message: "User not found!" }, 404);
        let response = {
            promo_code: promocode[0].promo_code,
            status: promocode[0].status,
            is_coupon: findUser.is_coupon === 0 ? false : true
        };
        return commonUtils_1.default.sendSuccess(req, res, response);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const gettechniques = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promocode = yield Techniques.find({ status: 1 }).select("_id title createdAt").sort({ createdAt: "desc" });
        return commonUtils_1.default.sendSuccess(req, res, promocode);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
function isPublicStatusChange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User.findOne({ _id: req.headers.userid });
            if (!user)
                return commonUtils_1.default.sendError(req, res, { message: "User not found!" }, 409);
            user.is_public = user.is_public === 1 ? 0 : 1;
            yield user.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "public post status change successfully" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function blockUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const { block_user_id } = req.body;
            let findBlockUSer = yield BlockUser.findOne({ user_id: auth_id, block_user_id: block_user_id });
            let msg;
            let status;
            if (findBlockUSer) {
                findBlockUSer.is_block = findBlockUSer.is_block == true ? false : true;
                yield findBlockUSer.save();
                if (findBlockUSer.is_block == true) {
                    let findFollowUser = yield FollowUnfollow.findOne({ user_id: auth_id, follow_user_id: block_user_id, is_follow: 1 });
                    if (findFollowUser) {
                        findFollowUser.is_follow = 0;
                        yield findFollowUser.save();
                    }
                    let findFollowUser2 = yield FollowUnfollow.findOne({ user_id: block_user_id, follow_user_id: auth_id, is_follow: 1 });
                    if (findFollowUser2) {
                        findFollowUser2.is_follow = 0;
                        yield findFollowUser2.save();
                    }
                }
                msg = findBlockUSer.is_block == true ? 'block' : 'unblock';
                status = findBlockUSer.is_block == true ? 1 : 0;
            }
            else {
                let blockUser = new BlockUser({
                    user_id: auth_id,
                    block_user_id: block_user_id
                });
                yield blockUser.save();
                msg = 'block';
                status = 1;
            }
            return commonUtils_1.default.sendSuccess(req, res, { message: 'User ' + msg + ' successfully!', status: status }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function blockUserList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            console.log(auth_id);
            const blockuserlist = yield BlockUser.aggregate([
                {
                    $match: { user_id: new mongoose.Types.ObjectId(auth_id), is_block: true }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'block_user_id',
                        foreignField: '_id',
                        as: 'user_data'
                    }
                },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        block_user_id: 1,
                        is_block: 1,
                        username: {
                            $concat: ["$user_data.firstname", " ", "$user_data.lastname"]
                        },
                        userimage: '$user_data.image'
                    },
                }
            ]);
            return commonUtils_1.default.sendSuccess(req, res, blockuserlist, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
exports.default = {
    guestLogin,
    register,
    edituser,
    getProfile,
    verifyOTP,
    login,
    forgotPassword,
    changePassword,
    updateprofile,
    signupVerifyOtp,
    sendVerifyEmail,
    getOTP,
    generateUniqueToken,
    resend,
    addPhone,
    verifyMobileOtp,
    sendSupportTicket,
    sendMessage,
    // socialLogin,
    WorkList,
    HunterTipList,
    getContactUs,
    getAboutUs,
    getTutorial,
    getSupportTickets,
    getMessages,
    notificationList,
    readNoti,
    resendPhone,
    promoCode,
    gettechniques,
    isPublicStatusChange,
    blockUser,
    blockUserList
};
//# sourceMappingURL=usercontroller.js.map