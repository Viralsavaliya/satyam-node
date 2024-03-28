import adminController from "./adminController";
// import auth from "../../auth/index";
import V from "./validation";
import encryptedData from "../../middlewares/secure/encryptData";
import decryptData from "../../middlewares/secure/decryptData";
// import Middlewares from "../../middlewares/validations";

export default [
  {
    path: "/register",
    method: "post",
    controller: adminController.register,
    validation: V.registerValidation,
    isPublic: true,
  },
  {
    path: "/login",
    method: "post",
    controller: adminController.login,
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
    controller: adminController.updateProfile,
    validation: V.profileValidation,
  },
  {
    path: "/profile",
    method: "get",
    controller: adminController.getProfile,
  },
  {
    path: "/changePassword",
    method: "post",
    controller: adminController.changePassword,
    validation: V.changePasswordValidation,
    isEncrypt: false,
    // isPublic: true
  },
  {
    path: "/encryption",
    method: "post",
    controller: encryptedData.encryptedDataRequest,
    isEncrypt: false,
    isPublic: true,
  },
  {
    path: "/decryption",
    method: "post",
    controller: decryptData.DecryptedDataRequest,
    isEncrypt: false,
    isPublic: true,
  },
  {
    path: "/dashboard",
    method: "get",
    controller: adminController.dashboard,
    // isPublic: true,
  },
  {
    path: "/userList",
    method: "get",
    controller: adminController.userList,
    // isPublic: true,
  },
  {
    path: "/allUserList",
    method: "get",
    controller: adminController.allUserList,
    // isPublic: true,
  },

  {
    path: "/brokerList",
    method: "get",
    controller: adminController.brokerList,
    // isPublic: true,
  },
  {
    path: "/changeUserStatus",
    method: "post",
    controller: adminController.changeUserStatus,
    isEncrypt: false,
    // isPublic: true,
  },
  {
    path: "/carriersubUserList",
    method: "get",
    controller: adminController.carrierSubUserList,
    // isPublic: true,
  },
  {
    path: "/workList",
    method: "get",
    controller: adminController.WorkList,
    // isPublic: true,
  },
  {
    path: "/creatework",
    method: "post",
    controller: adminController.CreateWork,
    validation: V.creatework,
    isPublic: true,
    // isEncrypt: false,
  },
  {
    path: "/updatework",
    method: "patch",
    controller: adminController.Updatework,
    validation: V.updatework,
    //isPublic: true,
    // isEncrypt: false,
  },
  {
    path: "/deletework",
    method: "delete",
    controller: adminController.Deletework,
    validation: V.updatework,
    // isPublic: true,
    // isEncrypt: false,
  },
  {
    path: "/bilList",
    method: "get",
    controller: adminController.bilList,
    // isPublic: true,
  },
  {
    path: "/createBil",
    method: "post",
    controller: adminController.createBil,
    // validation: V.createHuntertip,
    // isPublic: true,
    // isEncrypt: false,
  },
  {
    path: "/updateBil",
    method: "put",
    controller: adminController.updateBil,
    // validation: V.createTutorial,
    isEncrypt: false,
    // isPublic: true,
  },
  {
    path: "/pdfDownload",
    method: "post",
    controller: adminController.pdfDownload,
    isPublic:true
}, 
  {
    path: "/getSharedPostList/:id",
    method: "get",
    controller: adminController.getSharedPostList
  },
  {
    path: "/getSavedPostList/:id",
    method: "get",
    controller: adminController.getSavedPostList
  },
  {
    path: "/changestatushuntertip",
    method: "post",
    controller: adminController.changestatusHuntertip,
    isEncrypt: false,
    // isPublic: true,
  },
  {
    path: "/updatehuntertip",
    method: "patch",
    controller: adminController.UpdathunterTip,
    validation: V.updateHuntertip,
    isPublic: true,
    // isEncrypt: false,
  },
  {
    path: "/getTutorial",
    method: "get",
    controller: adminController.getTutorial
  },
  {
    path: "/createTutorial",
    method: "post",
    controller: adminController.CreateTutorial,
    validation: V.createTutorial,
    // isPublic: true,  
  },
  {
    path: "/updateTutorial",
    method: "post",
    controller: adminController.updateTutorial,
    validation: V.createTutorial,
    // isPublic: true,  
  },
  {
    path: "/changetutorialStatus/:id",
    method: "put",
    controller: adminController.changetutorialStatus,
    isEncrypt: false,
    // isPublic: true,
  },
  {
    path: "/uploadImage",
    method: "post",
    controller: adminController.uploadImage,
    // isPublic: true,
    // isEncrypt: false,
  },
  {
    path: "/purchaseplan",
    method: "get",
    controller: adminController.purchaseplan
  },
  {
    path: "/usersubscription",
    method: "get",
    controller: adminController.userSubscription
  },
  {
    path: "/usersubscriptionlist",
    method: "get",
    controller: adminController.userSubscriptionList
  },
  {
    path: "/getNotification",
    method: "get",
    controller: adminController.getNotification
  },
  {
    path: "/sendAlluserNotification",
    method: "post",
    controller: adminController.sendAlluserNotification
  },
  {
    path: "/promocode",
    method: "get",
    controller: adminController.promoCode
  },
  {
    path: "/changepromocodestatus",
    method: "post",
    controller: adminController.changePromoCodeStatus,
  },
  {
    path: "/createtechniques",
    method: "post",
    controller: adminController.createtechniques,
    validation: V.createtechniques,
  },
  {
    path: "/gettechniques",
    method: "get",
    controller: adminController.gettechniques,
  },
  {
    path: "/updatetechniques",
    method: "patch",
    controller: adminController.Updattechniques,
    validation: V.updatetechniques
  },
  {
    path: "/changestatustechniques",
    method: "post",
    controller: adminController.changestatustechniques,
  },
  {
    path: "/gettechniques",
    method: "get",
    controller: adminController.gettechniques,
  },
  {
    path: "/getpostreport",
    method: "get",
    controller: adminController.getpostreport,
  },
  {
    path: "/getuserreport",
    method: "get",
    controller: adminController.getuserreport,
  },
  {
    path: "/changeReportPostStatus",
    method: "post",
    controller: adminController.changeReportPostStatus,
  },
  {
    path: "/changeReportUserStatus",
    method: "post",
    controller: adminController.changeReportUserStatus,
  },
];
