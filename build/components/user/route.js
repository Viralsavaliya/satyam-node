"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../auth"));
const usercontroller_1 = __importDefault(require("./usercontroller"));
const validation_1 = __importDefault(require("./validation"));
exports.default = [
    {
        path: "/adduser",
        method: "post",
        controller: usercontroller_1.default.register,
        validation: validation_1.default.registerValidation,
        // isPublic: true,
        // isEncrypt: false
    },
    {
        path: "/edituser",
        method: "put",
        controller: usercontroller_1.default.edituser,
        validation: validation_1.default.edituserValidation,
        // isPublic: true,
        // isEncrypt: false
    },
    {
        path: "/otp/verify/signup",
        method: "post",
        controller: usercontroller_1.default.signupVerifyOtp,
        validation: validation_1.default.verifySignupOTPValidation,
        isPublic: true
    },
    {
        path: "/otp/get",
        method: "post",
        controller: usercontroller_1.default.getOTP,
        validation: validation_1.default.getForgetOTPValidation,
        isPublic: true,
    },
    {
        path: "/otp/verify",
        method: "post",
        controller: usercontroller_1.default.verifyOTP,
        validation: validation_1.default.verifyOTPValidation,
        isPublic: true,
    },
    {
        path: "/login",
        method: "post",
        controller: usercontroller_1.default.login,
        validation: validation_1.default.loginValidation,
        isPublic: true,
    },
    // {
    //     path: "/socialLogin",
    //     method: "post",
    //     controller: UserController.socialLogin,
    //     validation: V.socialLoginValidation,
    //     isPublic: true,
    // },
    {
        path: "/guestLogin",
        method: "post",
        controller: usercontroller_1.default.guestLogin,
        validation: validation_1.default.guestLoginValidation,
        isPublic: true,
    },
    {
        path: "/otp/resend",
        method: "post",
        controller: usercontroller_1.default.resend,
        validation: validation_1.default.resendOTPValidation,
        isPublic: true
    },
    {
        path: "/logout",
        method: "patch",
        controller: auth_1.default.logout,
        isEncrypt: false,
    },
    {
        path: "/getprofile",
        method: "get",
        controller: usercontroller_1.default.getProfile
    },
    {
        path: "/updateprofile",
        method: "post",
        controller: usercontroller_1.default.updateprofile
    },
    // {
    //     path: "/refreshToken",
    //     method: "get",
    //     controller: auth.getAccessToken,
    //     isPublic: true,
    // },
    {
        path: "/otp/forgotpassword",
        method: "post",
        controller: usercontroller_1.default.forgotPassword,
        validation: validation_1.default.forgotPasswordValidation,
        isPublic: true,
    },
    {
        path: "/changepassword",
        method: "post",
        controller: usercontroller_1.default.changePassword,
        validation: validation_1.default.changePasswordValidation,
    },
    {
        path: "/addPhone",
        method: "post",
        controller: usercontroller_1.default.addPhone,
        validation: validation_1.default.addPhoneValidation,
    },
    {
        path: "/resendPhone",
        method: "get",
        controller: usercontroller_1.default.resendPhone,
    },
    {
        path: "/verifyMobileOtp",
        method: "post",
        controller: usercontroller_1.default.verifyMobileOtp,
    },
    {
        path: "/sendSupportTicket",
        method: "post",
        controller: usercontroller_1.default.sendSupportTicket,
        validation: validation_1.default.addTicketValidation,
    },
    {
        path: "/getTickets",
        method: "get",
        controller: usercontroller_1.default.getSupportTickets,
    },
    {
        path: "/getMessages",
        method: "get",
        controller: usercontroller_1.default.getMessages,
    },
    {
        path: "/sendMessage",
        method: "post",
        controller: usercontroller_1.default.sendMessage,
        // validation: V.addTicketValidation,
    },
    {
        path: "/workList",
        method: "get",
        controller: usercontroller_1.default.WorkList
    },
    {
        path: "/hunterTipList",
        method: "get",
        controller: usercontroller_1.default.HunterTipList
    },
    {
        path: "/getContactUs",
        method: "get",
        controller: usercontroller_1.default.getContactUs,
    },
    {
        path: "/getAboutUs",
        method: "get",
        controller: usercontroller_1.default.getAboutUs
    },
    {
        path: "/getTutorial",
        method: "get",
        controller: usercontroller_1.default.getTutorial
    },
    {
        path: "/notificationList",
        method: "get",
        controller: usercontroller_1.default.notificationList
    },
    {
        path: "/readNotification",
        method: "get",
        controller: usercontroller_1.default.readNoti
    },
    {
        path: "/promocode",
        method: "get",
        controller: usercontroller_1.default.promoCode
    },
    {
        path: "/gettechniques",
        method: "get",
        controller: usercontroller_1.default.gettechniques,
    },
    {
        path: "/isPublicStatusChange",
        method: "get",
        controller: usercontroller_1.default.isPublicStatusChange,
    },
    {
        path: "/blockUser",
        method: "post",
        controller: usercontroller_1.default.blockUser,
        validation: validation_1.default.blockUserValidation,
    },
    {
        path: "/blockUserList",
        method: "get",
        controller: usercontroller_1.default.blockUserList,
    },
];
