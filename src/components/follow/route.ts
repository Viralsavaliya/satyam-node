import FollowController from "./followController";
import V from "./validation";

export default [
    {
        path: "/followUnfollow",
        method: "post",
        controller: FollowController.followUnfollow,
        validation: V.followValidation,
    },
    {
        path: "/removeFollower",
        method: "post",
        controller: FollowController.removeFollower,
        validation: V.removefollowValidation,
    },
    {
        path: "/followersfollowingList",
        method: "get",
        controller: FollowController.followersfollowingList
    },
    {
        path: "/getTerms",
        method: "get",
        controller: FollowController.getTerms,
        isPublic:true
    },
    {
        path: "/getPrivacy",
        method: "get",
        controller: FollowController.getPrivacy,
        isPublic:true
    },
    {
        path: "/getTermsAndPrivacy",
        method: "get",
        controller: FollowController.getTermsAndPrivacy,
        isPublic:true
    },
    {
        path: "/scan-form/post",
        method: "get",
        controller: FollowController.shareProfile,
        isEncrypt: false,
        isPublic: true
    },
    {
        path: "/getRefundPolicy",
        method: "get",
        controller: FollowController.getRefundPolicy,
        isPublic:true
    },
    {
        path: "/getEula",
        method: "get",
        controller: FollowController.getEula,
        isPublic:true
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