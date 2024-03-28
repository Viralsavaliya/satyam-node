import commonUtils from "../../utils/commonUtils";
import { Request, Response } from "express";
import commoncontroller from "../common/commoncontroller";

const Like = require("./likeModel");
const Comment = require("./commentModel");
const User = require("../user/userModel");
const Post = require("../post/postModel");
const mongoose = require("mongoose");

async function likeUnlike(req: Request, res: Response) {
    try {
        const auth_id = req.headers.userid;
        const existsRecord = await Like.findOne({ user_id: auth_id, post_id: req.body.post_id });
        let msg;

        if (existsRecord) {
            existsRecord.is_like = existsRecord.is_like === 1 ? 0 : 1;
            await existsRecord.save();

            existsRecord.is_like === 1 ? msg = 'Liked' : msg = 'Unlike';

            if (existsRecord.is_like == 1) {
                // send notification
                const post_user = await Post.findOne({ _id: req.body.post_id })
                if (post_user.user_id.toString() !== auth_id) {
                    const user = await User.findOne({ _id: post_user.user_id })
                    const senderuser = await User.findOne({ _id: auth_id });
                    const username = senderuser.firstname + ' ' + senderuser.lastname
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
                    await commoncontroller.sendNotification(auth_id, user, message, type)
                }
            }
        } else {
            let like = await new Like({
                user_id: auth_id,
                post_id: req.body.post_id
            })
            await like.save();
            msg = 'Liked';
            if (like.is_like == 1) {
                const post_user = await Post.findOne({ _id: req.body.post_id })
                if (post_user.user_id.toString() !== auth_id) {
                    const user = await User.findOne({ _id: post_user.user_id })
                    const senderuser = await User.findOne({ _id: auth_id });
                    const username = senderuser.firstname + ' ' + senderuser.lastname
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
                    await commoncontroller.sendNotification(auth_id, user, message, type)
                }
            }
        }

        return commonUtils.sendSuccess(req, res, { message: msg + " post successfully!" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function comment(req: Request, res: Response) {
    try {
        const auth_id = req.headers.userid;
        let findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(auth_id) })
        if (!findUser) return commonUtils.sendError(req, res, 'Not found user!', 404);

        let comment = await new Comment({
            user_id: auth_id,
            post_id: req.body.post_id,
            comment: req.body.comment
        })
        await comment.save();

        // send notification
        const post_user = await Post.findOne({ _id: req.body.post_id })
        // console.log("post_user", post_user)
        if (post_user) {
            if (post_user.user_id.toString() !== auth_id) {
                const user = await User.findOne({ _id: new mongoose.Types.ObjectId(post_user.user_id) })
                console.log("user", user)
                const senderuser = await User.findOne({ _id: auth_id });
                // console.log("senderuser", senderuser)
                const username = senderuser.firstname + ' ' + senderuser.lastname
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
                await commoncontroller.sendNotification(auth_id, user, message, type)
            }
        }
        return commonUtils.sendSuccess(req, res, comment, 200);
        // return commonUtils.sendSuccess(req, res, { message: "Comment send successfully!" }, 200);
    } catch (err: any) {
        console.log("errorrrrrrr", err);
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function commentList(req: Request, res: Response) {
    try {
        const auth_id = req.headers.userid;
        const page: number = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        // const total_ = await Post.find({ _id: new mongoose.Types.ObjectId(req.query.post_id) }).countDocuments();

        const postComment = await Post.aggregate([
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
        ])

        let findLike = await Like.findOne({ post_id: mongoose.Types.ObjectId(postComment[0]._id), user_id: mongoose.Types.ObjectId(auth_id) })
        if (findLike === null) {
            postComment[0].is_like = false;
        } else {
            if (findLike.is_like === 1) {
                postComment[0].is_like = true;
            } else {
                postComment[0].is_like = false;
            }
        }

        return commonUtils.sendSuccess(req, res, postComment[0], 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function deleteComment(req: Request, res: Response) {
    try {
        const auth_id = req.headers.userid;

        console.log(req.body.id)
        const comment_data = await Comment.findOne({ _id: new mongoose.Types.ObjectId(req.body.id) });
        if (!comment_data) return commonUtils.sendError(req, res, { message: "Not found comment data!" }, 404);

        if (auth_id == comment_data.user_id) {
            comment_data.status = 1;
            await comment_data.save();
            return commonUtils.sendSuccess(req, res, { message: "Comment delete successfully!" }, 200);

        } else {
            const post_data = await Post.findOne({ _id: new mongoose.Types.ObjectId(comment_data.post_id) });

            if (post_data.user_id == auth_id) {
                comment_data.status = 1;
                await comment_data.save();
                return commonUtils.sendSuccess(req, res, { message: "Comment delete successfully!" }, 200);
            }

            return commonUtils.sendError(req, res, { message: "You can't delete this comment!" }, 422);
        }

    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
export default {
    likeUnlike,
    comment,
    commentList,
    deleteComment
}