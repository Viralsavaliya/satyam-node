"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonUtils_1 = __importDefault(require("../../utils/commonUtils"));
const commoncontroller_1 = __importDefault(require("../common/commoncontroller"));
const Like = require("./likeModel");
const Comment = require("./commentModel");
const User = require("../user/userModel");
const Post = require("../post/postModel");
const mongoose = require("mongoose");
function likeUnlike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const existsRecord = yield Like.findOne({ user_id: auth_id, post_id: req.body.post_id });
            let msg;
            if (existsRecord) {
                existsRecord.is_like = existsRecord.is_like === 1 ? 0 : 1;
                yield existsRecord.save();
                existsRecord.is_like === 1 ? msg = 'Liked' : msg = 'Unlike';
                if (existsRecord.is_like == 1) {
                    // send notification
                    const post_user = yield Post.findOne({ _id: req.body.post_id });
                    if (post_user.user_id.toString() !== auth_id) {
                        const user = yield User.findOne({ _id: post_user.user_id });
                        const senderuser = yield User.findOne({ _id: auth_id });
                        const username = senderuser.firstname + ' ' + senderuser.lastname;
                        const type = 6;
                        const message = {
                            notification: {
                                title: "Like Post",
                                body: username + " liked your post."
                            },
                            data: {
                                id: String(senderuser._id),
                                post_id: String(req.body.post_id),
                                type: String(6)
                            }
                        };
                        yield commoncontroller_1.default.sendNotification(auth_id, user, message, type);
                    }
                }
            }
            else {
                let like = yield new Like({
                    user_id: auth_id,
                    post_id: req.body.post_id
                });
                yield like.save();
                msg = 'Liked';
                if (like.is_like == 1) {
                    const post_user = yield Post.findOne({ _id: req.body.post_id });
                    if (post_user.user_id.toString() !== auth_id) {
                        const user = yield User.findOne({ _id: post_user.user_id });
                        const senderuser = yield User.findOne({ _id: auth_id });
                        const username = senderuser.firstname + ' ' + senderuser.lastname;
                        const type = 6;
                        const message = {
                            notification: {
                                title: "Like Post",
                                body: username + " liked your post."
                            },
                            data: {
                                id: String(senderuser._id),
                                post_id: String(req.body.post_id),
                                type: String(6)
                            }
                        };
                        yield commoncontroller_1.default.sendNotification(auth_id, user, message, type);
                    }
                }
            }
            return commonUtils_1.default.sendSuccess(req, res, { message: msg + " post successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function comment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            let findUser = yield User.findOne({ _id: new mongoose.Types.ObjectId(auth_id) });
            if (!findUser)
                return commonUtils_1.default.sendError(req, res, 'Not found user!', 404);
            let comment = yield new Comment({
                user_id: auth_id,
                post_id: req.body.post_id,
                comment: req.body.comment
            });
            yield comment.save();
            // send notification
            const post_user = yield Post.findOne({ _id: req.body.post_id });
            // console.log("post_user", post_user)
            if (post_user) {
                if (post_user.user_id.toString() !== auth_id) {
                    const user = yield User.findOne({ _id: new mongoose.Types.ObjectId(post_user.user_id) });
                    console.log("user", user);
                    const senderuser = yield User.findOne({ _id: auth_id });
                    // console.log("senderuser", senderuser)
                    const username = senderuser.firstname + ' ' + senderuser.lastname;
                    const type = 6;
                    const message = {
                        notification: {
                            title: "Comment Post",
                            body: username + " commented on your post."
                        },
                        data: {
                            id: String(auth_id),
                            post_id: String(req.body.post_id),
                            type: String(6)
                        }
                    };
                    yield commoncontroller_1.default.sendNotification(auth_id, user, message, type);
                }
            }
            return commonUtils_1.default.sendSuccess(req, res, comment, 200);
            // return commonUtils.sendSuccess(req, res, { message: "Comment send successfully!" }, 200);
        }
        catch (err) {
            console.log("errorrrrrrr", err);
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function commentList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            // const total_ = await Post.find({ _id: new mongoose.Types.ObjectId(req.query.post_id) }).countDocuments();
            const postComment = yield Post.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.query.post_id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user_data'
                    },
                },
                {
                    $lookup: {
                        from: 'likes',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'like_data'
                    },
                },
                {
                    $lookup: {
                        from: 'comments',
                        let: { postId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$post_id', '$$postId'] },
                                    status: 0
                                }
                            }
                        ],
                        as: 'comment_data'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'comment_data.user_id',
                        foreignField: '_id',
                        as: 'comment_user'
                    },
                },
                {
                    $lookup: {
                        from: 'followfollowers',
                        localField: 'user_id',
                        foreignField: 'follow_user_id',
                        pipeline: [
                            {
                                $match: { $expr: { $eq: ["$user_id", new mongoose.Types.ObjectId(auth_id)] } }
                            },
                        ],
                        as: 'is_follow',
                    },
                },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$post_data", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$is_follow", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        image: 1,
                        createdAt: 1,
                        user_name: { $concat: ['$user_data.firstname', ' ', '$user_data.lastname'] },
                        user_image: '$user_data.image',
                        is_follow: '$is_follow.is_follow',
                        like_count: {
                            $size: {
                                $filter: {
                                    input: '$like_data',
                                    as: 'like',
                                    cond: { $eq: ['$$like.is_like', 1] }
                                }
                            }
                        },
                        commentCount: { $size: '$comment_data' },
                        comment_data: {
                            $slice: [
                                {
                                    $map: {
                                        input: '$comment_data',
                                        as: 'comment',
                                        in: {
                                            _id: '$$comment._id',
                                            comment: '$$comment.comment',
                                            createdAt: '$$comment.createdAt',
                                            user_id: {
                                                $arrayElemAt: [
                                                    {
                                                        $map: {
                                                            input: '$comment_user',
                                                            as: 'cu',
                                                            in: '$$cu._id'
                                                        }
                                                    },
                                                    { $indexOfArray: ['$comment_user._id', '$$comment.user_id'] }
                                                ]
                                            },
                                            user_image: {
                                                $arrayElemAt: [
                                                    {
                                                        $map: {
                                                            input: '$comment_user',
                                                            as: 'cu',
                                                            in: '$$cu.image'
                                                        }
                                                    },
                                                    { $indexOfArray: ['$comment_user._id', '$$comment.user_id'] }
                                                ]
                                            },
                                            user_name: {
                                                $concat: [
                                                    {
                                                        $arrayElemAt: [
                                                            {
                                                                $map: {
                                                                    input: '$comment_user',
                                                                    as: 'cu',
                                                                    in: '$$cu.firstname'
                                                                }
                                                            },
                                                            { $indexOfArray: ['$comment_user._id', '$$comment.user_id'] }
                                                        ]
                                                    },
                                                    ' ',
                                                    {
                                                        $arrayElemAt: [
                                                            {
                                                                $map: {
                                                                    input: '$comment_user',
                                                                    as: 'cu',
                                                                    in: '$$cu.lastname'
                                                                }
                                                            },
                                                            { $indexOfArray: ['$comment_user._id', '$$comment.user_id'] }
                                                        ]
                                                    }
                                                ]
                                            },
                                            // first_name: {
                                            //     $arrayElemAt: [
                                            //         {
                                            //             $map: {
                                            //                 input: '$comment_user',
                                            //                 as: 'cu',
                                            //                 in: '$$cu.firstname'
                                            //             }
                                            //         },
                                            //         { $indexOfArray: ['$comment_user._id', '$$comment.user_id'] }
                                            //     ]
                                            // },
                                            // last_name: {
                                            //     $arrayElemAt: [
                                            //         {
                                            //             $map: {
                                            //                 input: '$comment_user',
                                            //                 as: 'cu',
                                            //                 in: '$$cu.lastname'
                                            //             }
                                            //         },
                                            //         { $indexOfArray: ['$comment_user._id', '$$comment.user_id'] }
                                            //     ]
                                            // },
                                        }
                                    }
                                }, skip, limit
                            ]
                        }
                    }
                }
            ]);
            let findLike = yield Like.findOne({ post_id: mongoose.Types.ObjectId(postComment[0]._id), user_id: mongoose.Types.ObjectId(auth_id) });
            if (findLike === null) {
                postComment[0].is_like = false;
            }
            else {
                if (findLike.is_like === 1) {
                    postComment[0].is_like = true;
                }
                else {
                    postComment[0].is_like = false;
                }
            }
            return commonUtils_1.default.sendSuccess(req, res, postComment[0], 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            console.log(req.body.id);
            const comment_data = yield Comment.findOne({ _id: new mongoose.Types.ObjectId(req.body.id) });
            if (!comment_data)
                return commonUtils_1.default.sendError(req, res, { message: "Not found comment data!" }, 404);
            if (auth_id == comment_data.user_id) {
                comment_data.status = 1;
                yield comment_data.save();
                return commonUtils_1.default.sendSuccess(req, res, { message: "Comment delete successfully!" }, 200);
            }
            else {
                const post_data = yield Post.findOne({ _id: new mongoose.Types.ObjectId(comment_data.post_id) });
                if (post_data.user_id == auth_id) {
                    comment_data.status = 1;
                    yield comment_data.save();
                    return commonUtils_1.default.sendSuccess(req, res, { message: "Comment delete successfully!" }, 200);
                }
                return commonUtils_1.default.sendError(req, res, { message: "You can't delete this comment!" }, 422);
            }
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
exports.default = {
    likeUnlike,
    comment,
    commentList,
    deleteComment
};
//# sourceMappingURL=likeController.js.map