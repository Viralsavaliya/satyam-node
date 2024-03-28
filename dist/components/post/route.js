"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postController_1 = __importDefault(require("./postController"));
const validation_1 = __importDefault(require("./validation"));
exports.default = [
    {
        path: "/savedPost",
        method: "post",
        controller: postController_1.default.savedPost,
        validation: validation_1.default.savedPostValidation,
    },
    {
        path: "/SharedPost",
        method: "post",
        controller: postController_1.default.SharedPost,
        validation: validation_1.default.sharedPostValidation,
    },
    {
        path: "/getAllPost",
        method: "get",
        controller: postController_1.default.getAllPost
    },
    {
        path: "/postFollowFollowingDetails",
        method: "get",
        controller: postController_1.default.postFollowFollowingDetails
    },
    {
        path: "/userSharedPostList",
        method: "get",
        controller: postController_1.default.userSharedPostList
    },
    {
        path: "/deletePost",
        method: "delete",
        controller: postController_1.default.deletePost,
        validation: validation_1.default.deletePostValidation,
    },
    {
        path: "/savedPostList",
        method: "get",
        controller: postController_1.default.savedPostList
    },
    {
        path: "/createFolder",
        method: "post",
        controller: postController_1.default.createFolder,
        validation: validation_1.default.createFolderValidation,
    },
    // { 
    //     path: "/sharedPostList",
    //     method: "get",
    //     controller: PostController.sharedPostList
    // },
    // {
    //     path: "/recentPostList",
    //     method: "get",
    //     controller: PostController.recentPostList
    // },
    // {
    //     path: "/savedFolderList",
    //     method: "get",
    //     controller: PostController.savedFolderList
    // },
    {
        path: "/recentPost",
        method: "post",
        controller: postController_1.default.recentPost,
        validation: validation_1.default.recentPostValidation,
    },
    {
        path: "/mediaPostList",
        method: "get",
        controller: postController_1.default.mediaPostList
    },
    {
        path: "/setCoverImage",
        method: "post",
        controller: postController_1.default.setCoverImage
    },
    {
        path: "/deletefolder",
        method: "delete",
        controller: postController_1.default.deletefolder
    },
    {
        path: "/folderstatuscheck",
        method: "post",
        controller: postController_1.default.folderstatuscheck
    },
    {
        path: "/suggestion",
        method: "get",
        controller: postController_1.default.getsuggestion
    }
];
//# sourceMappingURL=route.js.map