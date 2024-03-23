import PostController from "./postController";
import V from "./validation";

export default [
    {
        path: "/savedPost",
        method: "post",
        controller: PostController.savedPost,
        validation: V.savedPostValidation,
    },
    {
        path: "/SharedPost",
        method: "post",
        controller: PostController.SharedPost,
        validation: V.sharedPostValidation,
    },
    {
        path: "/getAllPost",
        method: "get",
        controller: PostController.getAllPost
    },
    {
        path: "/postFollowFollowingDetails",
        method: "get",
        controller: PostController.postFollowFollowingDetails
    },
    {
        path: "/userSharedPostList",
        method: "get",
        controller: PostController.userSharedPostList
    },
    {
        path: "/deletePost",
        method: "delete",
        controller: PostController.deletePost,
        validation: V.deletePostValidation,
    },
    {
        path: "/savedPostList",
        method: "get",
        controller: PostController.savedPostList
    },
    {
        path: "/createFolder",
        method: "post",
        controller: PostController.createFolder,
        validation: V.createFolderValidation,
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
        controller: PostController.recentPost,
        validation: V.recentPostValidation,
    },
    {
        path: "/mediaPostList",
        method: "get",
        controller: PostController.mediaPostList
    },
    {
        path: "/setCoverImage",
        method: "post",
        controller: PostController.setCoverImage
    },
    {
        path: "/deletefolder",
        method: "delete",
        controller: PostController.deletefolder
    },
    {
        path: "/folderstatuscheck",
        method: "post",
        controller: PostController.folderstatuscheck
    },
    {
        path: "/suggestion",
        method: "get",
        controller: PostController.getsuggestion
    }
];