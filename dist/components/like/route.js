"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const likeController_1 = __importDefault(require("./likeController"));
const validation_1 = __importDefault(require("./validation"));
exports.default = [
    {
        path: "/likeUnlike",
        method: "post",
        controller: likeController_1.default.likeUnlike,
        validation: validation_1.default.likeUnlikeValidation,
    },
    {
        path: "/deleteComment",
        method: "delete",
        controller: likeController_1.default.deleteComment,
    },
    {
        path: "/comment",
        method: "post",
        controller: likeController_1.default.comment,
        validation: validation_1.default.commentValidation,
    },
    {
        path: "/commentList",
        method: "get",
        controller: likeController_1.default.commentList,
        // validation: V.commentValidation,
    },
];
//# sourceMappingURL=route.js.map