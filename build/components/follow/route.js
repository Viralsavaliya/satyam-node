"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const followController_1 = __importDefault(require("./followController"));
const validation_1 = __importDefault(require("./validation"));
exports.default = [
    {
        path: "/followUnfollow",
        method: "post",
        controller: followController_1.default.followUnfollow,
        validation: validation_1.default.followValidation,
    },
    {
        path: "/removeFollower",
        method: "post",
        controller: followController_1.default.removeFollower,
        validation: validation_1.default.removefollowValidation,
    },
    {
        path: "/followersfollowingList",
        method: "get",
        controller: followController_1.default.followersfollowingList
    },
    {
        path: "/getTerms",
        method: "get",
        controller: followController_1.default.getTerms,
        isPublic: true
    },
    {
        path: "/getPrivacy",
        method: "get",
        controller: followController_1.default.getPrivacy,
        isPublic: true
    },
    {
        path: "/getTermsAndPrivacy",
        method: "get",
        controller: followController_1.default.getTermsAndPrivacy,
        isPublic: true
    },
    {
        path: "/scan-form/post",
        method: "get",
        controller: followController_1.default.shareProfile,
        isEncrypt: false,
        isPublic: true
    },
    {
        path: "/getRefundPolicy",
        method: "get",
        controller: followController_1.default.getRefundPolicy,
        isPublic: true
    },
    {
        path: "/getEula",
        method: "get",
        controller: followController_1.default.getEula,
        isPublic: true
    },
    // {
    //     path: "/followersList",
    //     method: "get",
    //     controller: FollowController.followersList
    // },
    // {
    //     path: "/followingList",
    //     method: "get",
    //     controller: FollowController.followingList
    // },
];
