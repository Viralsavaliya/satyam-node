import LikeController from "./likeController";
import V from "./validation";

export default [
    {
        path: "/likeUnlike",
        method: "post",
        controller: LikeController.likeUnlike,
        validation: V.likeUnlikeValidation,
    },
    {
        path: "/deleteComment",
        method: "delete",
        controller: LikeController.deleteComment,
    },
    {
        path: "/comment",
        method: "post",
        controller: LikeController.comment,
        validation: V.commentValidation,
    },
    {
        path: "/commentList",
        method: "get",
        controller: LikeController.commentList,
        // validation: V.commentValidation,
    },
];