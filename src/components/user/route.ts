import auth from "../../auth";
import UserController from "./usercontroller";
import V from "./validation";

export default [
    {
        path: "/adduser",
        method: "post",
        controller: UserController.register,
        validation: V.registerValidation,
        // isPublic: true,
        // isEncrypt: false
    },
    {
        path: "/edituser",
        method: "put",
        controller: UserController.edituser,
        validation: V.edituserValidation,
        // isPublic: true,
        // isEncrypt: false
    },
    {
        path: "/otp/verify/signup",
        method: "post",
        controller: UserController.signupVerifyOtp,
        validation: V.verifySignupOTPValidation,
        isPublic: true
    },
    {
        path: "/otp/get",
        method: "post",
        controller: UserController.getOTP,
        validation: V.getForgetOTPValidation,
        isPublic: true,
    },
    {
        path: "/otp/verify",
        method: "post",
        controller: UserController.verifyOTP,
        validation: V.verifyOTPValidation,
        isPublic: true,
    },
    {
        path: "/login",
        method: "post",
        controller: UserController.login,
        validation: V.loginValidation,
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
        controller: UserController.guestLogin,
        validation: V.guestLoginValidation,
        isPublic: true,
    },
    {
        path: "/otp/resend",
        method: "post",
        controller: UserController.resend,
        validation: V.resendOTPValidation,
        isPublic: true
    },
    {
        path: "/logout",
        method: "patch",
        controller: auth.logout,
        isEncrypt: false,
    },
    {
        path: "/getprofile",
        method: "get",
        controller: UserController.getProfile
    },
    {
        path: "/updateprofile",
        method: "post",
        controller: UserController.updateprofile
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
        controller: UserController.forgotPassword,
        validation: V.forgotPasswordValidation,
        isPublic: true,
    },
    {
        path: "/changepassword",
        method: "post",
        controller: UserController.changePassword,
        validation: V.changePasswordValidation,
    },
    {
        path: "/addPhone",
        method: "post",
        controller: UserController.addPhone,
        validation: V.addPhoneValidation,
    },
    {
        path: "/resendPhone",
        method: "get",
        controller: UserController.resendPhone,
    },
    {
        path: "/verifyMobileOtp",
        method: "post",
        controller: UserController.verifyMobileOtp,
    },
    {
        path: "/sendSupportTicket",
        method: "post",
        controller: UserController.sendSupportTicket,
        validation: V.addTicketValidation,
    },
    {
        path: "/getTickets",
        method: "get",
        controller: UserController.getSupportTickets,
    },
    {
        path: "/getMessages",
        method: "get",
        controller: UserController.getMessages,
    },
    {
        path: "/sendMessage",
        method: "post",
        controller: UserController.sendMessage,
        // validation: V.addTicketValidation,
    },
    {
        path: "/workList",
        method: "get",
        controller: UserController.WorkList
    },
    {
        path: "/hunterTipList",
        method: "get",
        controller: UserController.HunterTipList
    },
    {
        path: "/getContactUs",
        method: "get",
        controller: UserController.getContactUs,
    },
    {
        path: "/getAboutUs",
        method: "get",
        controller: UserController.getAboutUs
    },
    {
        path: "/getTutorial",
        method: "get",
        controller: UserController.getTutorial
    },
    {
        path: "/notificationList",
        method: "get",
        controller: UserController.notificationList
    },
    {
        path: "/readNotification",
        method: "get",
        controller: UserController.readNoti
    },
    {
        path: "/promocode",
        method: "get",
        controller: UserController.promoCode
    },
    {
        path: "/gettechniques",
        method: "get",
        controller: UserController.gettechniques,
    },
    {
        path: "/isPublicStatusChange",
        method: "get",
        controller: UserController.isPublicStatusChange,
    },
    {
        path: "/blockUser",
        method: "post",
        controller: UserController.blockUser,
        validation: V.blockUserValidation,
    },
    {
        path: "/blockUserList",
        method: "get",
        controller: UserController.blockUserList,
    },
];