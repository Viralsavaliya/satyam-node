"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminController_1 = __importDefault(require("./adminController"));
// import auth from "../../auth/index";
const validation_1 = __importDefault(require("./validation"));
const encryptData_1 = __importDefault(require("../../middlewares/secure/encryptData"));
const decryptData_1 = __importDefault(require("../../middlewares/secure/decryptData"));
// import Middlewares from "../../middlewares/validations";
exports.default = [
    {
        path: "/register",
        method: "post",
        controller: adminController_1.default.register,
        validation: validation_1.default.registerValidation,
        isPublic: true,
    },
    {
        path: "/login",
        method: "post",
        controller: adminController_1.default.login,
        isPublic: true,
    },
    // {
    //   path: "/logout",
    //   method: "patch",
    //   controller: adminController.logout,
    //   isEncrypt: false,
    // },
    // {
    //   path: "/refreshToken",
    //   method: "get",
    //   controller: adminController.refreshToken,
    //   authMiddleware: Middlewares.verifyAdminAccessToken,
    // },
    {
        path: "/updateprofile",
        method: "patch",
        controller: adminController_1.default.updateProfile,
        validation: validation_1.default.profileValidation,
    },
    {
        path: "/profile",
        method: "get",
        controller: adminController_1.default.getProfile,
    },
    {
        path: "/changePassword",
        method: "post",
        controller: adminController_1.default.changePassword,
        validation: validation_1.default.changePasswordValidation,
        isEncrypt: false,
        // isPublic: true
    },
    {
        path: "/encryption",
        method: "post",
        controller: encryptData_1.default.encryptedDataRequest,
        isEncrypt: false,
        isPublic: true,
    },
    {
        path: "/decryption",
        method: "post",
        controller: decryptData_1.default.DecryptedDataRequest,
        isEncrypt: false,
        isPublic: true,
    },
    {
        path: "/dashboard",
        method: "get",
        controller: adminController_1.default.dashboard,
        // isPublic: true,
    },
    {
        path: "/userList",
        method: "get",
        controller: adminController_1.default.userList,
        isPublic: true,
    },
    {
        path: "/allUserList",
        method: "get",
        controller: adminController_1.default.allUserList,
        // isPublic: true,
    },
    {
        path: "/brokerList",
        method: "get",
        controller: adminController_1.default.brokerList,
        // isPublic: true,
    },
    {
        path: "/changeUserStatus",
        method: "post",
        controller: adminController_1.default.changeUserStatus,
        isEncrypt: false,
        // isPublic: true,
    },
    {
        path: "/carriersubUserList",
        method: "get",
        controller: adminController_1.default.carrierSubUserList,
        // isPublic: true,
    },
    {
        path: "/workList",
        method: "get",
        controller: adminController_1.default.WorkList,
        // isPublic: true,
    },
    {
        path: "/creatework",
        method: "post",
        controller: adminController_1.default.CreateWork,
        validation: validation_1.default.creatework,
        isPublic: true,
        // isEncrypt: false,
    },
    {
        path: "/updatework",
        method: "patch",
        controller: adminController_1.default.Updatework,
        validation: validation_1.default.updatework,
        //isPublic: true,
        // isEncrypt: false,
    },
    {
        path: "/deletework",
        method: "delete",
        controller: adminController_1.default.Deletework,
        validation: validation_1.default.updatework,
        // isPublic: true,
        // isEncrypt: false,
    },
    {
        path: "/bilList",
        method: "get",
        controller: adminController_1.default.bilList,
        // isPublic: true,
    },
    {
        path: "/createBil",
        method: "post",
        controller: adminController_1.default.createBil,
        // validation: V.createHuntertip,
        // isPublic: true,
        // isEncrypt: false,
    },
    {
        path: "/updateBil",
        method: "put",
        controller: adminController_1.default.updateBil,
        // validation: V.createTutorial,
        isEncrypt: false,
        // isPublic: true,
    },
    {
        path: "/pdfDownload",
        method: "post",
        controller: adminController_1.default.pdfDownload,
        isPublic: true
    },
    {
        path: "/getSharedPostList/:id",
        method: "get",
        controller: adminController_1.default.getSharedPostList
    },
    {
        path: "/getSavedPostList/:id",
        method: "get",
        controller: adminController_1.default.getSavedPostList
    },
    {
        path: "/changestatushuntertip",
        method: "post",
        controller: adminController_1.default.changestatusHuntertip,
        isEncrypt: false,
        // isPublic: true,
    },
    {
        path: "/updatehuntertip",
        method: "patch",
        controller: adminController_1.default.UpdathunterTip,
        validation: validation_1.default.updateHuntertip,
        isPublic: true,
        // isEncrypt: false,
    },
    {
        path: "/getTutorial",
        method: "get",
        controller: adminController_1.default.getTutorial
    },
    {
        path: "/createTutorial",
        method: "post",
        controller: adminController_1.default.CreateTutorial,
        validation: validation_1.default.createTutorial,
        // isPublic: true,  
    },
    {
        path: "/updateTutorial",
        method: "post",
        controller: adminController_1.default.updateTutorial,
        validation: validation_1.default.createTutorial,
        // isPublic: true,  
    },
    {
        path: "/changetutorialStatus/:id",
        method: "put",
        controller: adminController_1.default.changetutorialStatus,
        isEncrypt: false,
        // isPublic: true,
    },
    {
        path: "/uploadImage",
        method: "post",
        controller: adminController_1.default.uploadImage,
        // isPublic: true,
        // isEncrypt: false,
    },
    {
        path: "/purchaseplan",
        method: "get",
        controller: adminController_1.default.purchaseplan
    },
    {
        path: "/usersubscription",
        method: "get",
        controller: adminController_1.default.userSubscription
    },
    {
        path: "/usersubscriptionlist",
        method: "get",
        controller: adminController_1.default.userSubscriptionList
    },
    {
        path: "/getNotification",
        method: "get",
        controller: adminController_1.default.getNotification
    },
    {
        path: "/sendAlluserNotification",
        method: "post",
        controller: adminController_1.default.sendAlluserNotification
    },
    {
        path: "/promocode",
        method: "get",
        controller: adminController_1.default.promoCode
    },
    {
        path: "/changepromocodestatus",
        method: "post",
        controller: adminController_1.default.changePromoCodeStatus,
    },
    {
        path: "/createtechniques",
        method: "post",
        controller: adminController_1.default.createtechniques,
        validation: validation_1.default.createtechniques,
    },
    {
        path: "/gettechniques",
        method: "get",
        controller: adminController_1.default.gettechniques,
    },
    {
        path: "/updatetechniques",
        method: "patch",
        controller: adminController_1.default.Updattechniques,
        validation: validation_1.default.updatetechniques
    },
    {
        path: "/changestatustechniques",
        method: "post",
        controller: adminController_1.default.changestatustechniques,
    },
    {
        path: "/gettechniques",
        method: "get",
        controller: adminController_1.default.gettechniques,
    },
    {
        path: "/getpostreport",
        method: "get",
        controller: adminController_1.default.getpostreport,
    },
    {
        path: "/getuserreport",
        method: "get",
        controller: adminController_1.default.getuserreport,
    },
    {
        path: "/changeReportPostStatus",
        method: "post",
        controller: adminController_1.default.changeReportPostStatus,
    },
    {
        path: "/changeReportUserStatus",
        method: "post",
        controller: adminController_1.default.changeReportUserStatus,
    },
];
//# sourceMappingURL=route.js.map