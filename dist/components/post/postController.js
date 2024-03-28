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
const Post = require("./postModel");
const SavedPostFolder = require("./savedPostFolderModel");
const SavedSharedPost = require("./savedSharePostModel");
const FollowUnfollow = require("./../follow/followModel");
const User = require("./../user/userModel");
const Like = require("../like/likeModel");
const CoverImage = require("./coverImageModel");
const mongoose = require("mongoose");
const { format } = require('date-fns');
const UserNotification = require("../notification/notificationModel");
const BlockUser = require("../user/blockUserModel");
const log4js = require("log4js");
const logger = log4js.getLogger();
const createPost = (user_id, image, latitude, longitude, city, country, is_compare, flag) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = yield new Post({
            user_id: user_id,
            image: image,
            latitude: latitude,
            longitude: longitude,
            city: city,
            country: country,
            is_compare: is_compare,
        });
        yield post.save();
        if (flag === 'shared') {
            const users = yield FollowUnfollow.aggregate([
                {
                    $match: {
                        follow_user_id: new mongoose.Types.ObjectId(user_id),
                        is_follow: 1
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userdata'
                    },
                },
                { $unwind: { path: "$userdata", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        userdata: {
                            _id: 1,
                            pushToken: 1
                        }
                    }
                }
            ]);
            const user = yield User.findOne({ _id: new mongoose.Types.ObjectId(user_id) });
            const username = user.firstname + ' ' + user.lastname;
            const type = 2;
            const message = {
                notification: {
                    title: "Create Post",
                    body: username + " created a post."
                },
                data: {
                    id: String(post._id),
                    type: String(2)
                }
            };
            yield Promise.all(users.map((data) => __awaiter(void 0, void 0, void 0, function* () {
                yield commoncontroller_1.default.sendNotification(user_id, data.userdata, message, type);
            })));
        }
        return post;
    }
    catch (err) {
        console.log('createPost', err);
    }
});
function savedPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folderexist = yield SavedPostFolder.findOne({
                user_id: req.headers.userid,
                folder_name: req.body.folder_name
            });
            if (folderexist) {
                return commonUtils_1.default.sendError(req, res, { message: 'This folder already exist' }, 422);
            }
            const { image, folder_name, folder_id, latitude, longitude, city, country, is_compare } = req.body;
            let folderId = folder_id;
            const auth_id = req.headers.userid;
            let post = yield createPost(auth_id, image, latitude, longitude, city, country, is_compare, 'save');
            let savedFolder = yield new SavedPostFolder({
                user_id: auth_id,
                folder_name: folder_name
            });
            if (folder_name) {
                yield savedFolder.save();
                folderId = savedFolder._id;
            }
            let savedSharedPost = yield new SavedSharedPost({
                folder_id: folderId,
                post_id: post._id,
                type: 1
            });
            yield savedSharedPost.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Post save succesfully!", post_id: post._id }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function SharedPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { image, latitude, longitude, city, country, is_compare } = req.body;
            const auth_id = req.headers.userid;
            let post = yield createPost(auth_id, image, latitude, longitude, city, country, is_compare, 'shared');
            let savedSharedPost = yield new SavedSharedPost({
                post_id: post._id,
                type: 2
            });
            yield savedSharedPost.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Post shared succesfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getAllPostold(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            // const total = await Post.aggregate([
            //     {
            //         $match: {
            //             is_delete: 0
            //         },
            //     },
            //     {
            //         $lookup: {
            //             from: 'savedsharedposts',
            //             localField: '_id',
            //             foreignField: 'post_id',
            //             as: 'post_data'
            //         },
            //     },
            //     {
            //         $match: {
            //             'post_data.type': 2,
            //         },
            //     },
            //     {
            //         $count: 'totalCount', // Alias for the count result
            //     },
            // ]);
            // const total_ = total[0] ? total[0].totalCount : 0;
            const posts = yield Post.aggregate([
                {
                    $match: {
                        is_delete: 0
                    },
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
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'post_data'
                    },
                },
                {
                    $match: {
                        'post_data.type': 2,
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
                { $sort: { createdAt: -1 } },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$is_follow", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$post_data", preserveNullAndEmptyArrays: true } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        image: 1,
                        latitude: 1,
                        longitude: 1,
                        city: 1,
                        country: 1,
                        createdAt: 1,
                        user_name: { $concat: ['$user_data.firstname', ' ', '$user_data.lastname'] },
                        user_image: '$user_data.image',
                        is_subscription: '$user_data.is_subscription',
                        is_follow: { $ifNull: ['$is_follow.is_follow', 0] },
                        like_count: {
                            $size: {
                                $filter: {
                                    input: '$like_data',
                                    as: 'like',
                                    cond: { $eq: ['$$like.is_like', 1] }
                                }
                            }
                        },
                        comment_count: { $size: '$comment_data' },
                        first_comment: {
                            $cond: [
                                { $eq: [{ $size: '$comment_data' }, 0] },
                                '$REMOVE',
                                {
                                    $mergeObjects: [
                                        { comment: { $arrayElemAt: ['$comment_data.comment', 0] } },
                                        { createdAt: { $arrayElemAt: ['$comment_data.createdAt', 0] } },
                                        { _id: { $arrayElemAt: ['$comment_data._id', 0] } },
                                        { user_id: { $arrayElemAt: ['$comment_data.user_id', 0] } },
                                    ],
                                }
                            ],
                        },
                    }
                },
                {
                    "$lookup": {
                        "from": 'users',
                        "let": { "commentUserId": "$first_comment.user_id" },
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": { "$eq": ["$_id", "$$commentUserId"] }
                                }
                            },
                            {
                                "$project": {
                                    'first_name': '$firstname',
                                    'last_name': '$lastname',
                                    'user_image': '$image',
                                    "_id": 0,
                                }
                            }
                        ],
                        "as": 'comment_user'
                    }
                },
                { $unwind: { path: "$comment_user", preserveNullAndEmptyArrays: true } },
            ]);
            yield Promise.all(posts.map((data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let findLike = yield Like.findOne({ post_id: mongoose.Types.ObjectId(data._id), user_id: mongoose.Types.ObjectId(auth_id) });
                    if (findLike === null) {
                        data.is_like = false;
                    }
                    else {
                        if (findLike.is_like === 1) {
                            data.is_like = true;
                        }
                        else {
                            data.is_like = false;
                        }
                    }
                    const mergedComment = Object.assign(Object.assign({}, data.first_comment), data.comment_user);
                    if (data.first_comment != undefined && data.comment_user != undefined) {
                        data.comment_data = mergedComment;
                        delete data.first_comment;
                        delete data.comment_user;
                    }
                }
                catch (e) {
                    console.log('err', e);
                }
            })));
            const filteredResult = [];
            for (const post of posts) {
                const post_user = yield User.findOne({ _id: auth_id });
                if (post_user.is_public === 1) {
                    filteredResult.push(post);
                }
                else if (post.is_follow === 1) {
                    filteredResult.push(post);
                }
            }
            const notificationscount = yield UserNotification.find({ receiver_id: new mongoose.Types.ObjectId(auth_id), is_read: false });
            return commonUtils_1.default.sendSuccess(req, res, { filteredResult, notificationscount: notificationscount.length }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getAllPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const allPosts = yield Post.aggregate([
                {
                    $match: {
                        is_delete: 0,
                        is_reported: 0
                    },
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
                    $match: {
                        'user_data.is_delete_account': 0,
                        'user_data.status': 1
                    }
                },
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'post_data'
                    },
                },
                {
                    $match: {
                        'post_data.type': 2,
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
                { $sort: { createdAt: -1 } },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$is_follow", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$post_data", preserveNullAndEmptyArrays: true } },
                // { $skip: skip },
                // { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        image: 1,
                        latitude: 1,
                        longitude: 1,
                        city: 1,
                        country: 1,
                        createdAt: 1,
                        user_name: { $concat: ['$user_data.firstname', ' ', '$user_data.lastname'] },
                        user_image: '$user_data.image',
                        is_subscription: '$user_data.is_subscription',
                        is_follow: { $ifNull: ['$is_follow.is_follow', 0] },
                        like_count: {
                            $size: {
                                $filter: {
                                    input: '$like_data',
                                    as: 'like',
                                    cond: { $eq: ['$$like.is_like', 1] }
                                }
                            }
                        },
                        comment_count: { $size: '$comment_data' },
                        first_comment: {
                            $cond: [
                                { $eq: [{ $size: '$comment_data' }, 0] },
                                '$REMOVE',
                                {
                                    $mergeObjects: [
                                        { comment: { $arrayElemAt: ['$comment_data.comment', 0] } },
                                        { createdAt: { $arrayElemAt: ['$comment_data.createdAt', 0] } },
                                        { _id: { $arrayElemAt: ['$comment_data._id', 0] } },
                                        { user_id: { $arrayElemAt: ['$comment_data.user_id', 0] } },
                                    ],
                                }
                            ],
                        },
                    }
                },
                {
                    "$lookup": {
                        "from": 'users',
                        "let": { "commentUserId": "$first_comment.user_id" },
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": { "$eq": ["$_id", "$$commentUserId"] }
                                }
                            },
                            {
                                "$project": {
                                    'first_name': '$firstname',
                                    'last_name': '$lastname',
                                    'user_image': '$image',
                                    "_id": 0,
                                }
                            }
                        ],
                        "as": 'comment_user'
                    }
                },
                { $unwind: { path: "$comment_user", preserveNullAndEmptyArrays: true } },
            ]);
            let posts = [];
            const post_user = yield User.findOne({ _id: auth_id });
            if (post_user.is_public === 0) {
                const filteredPosts = allPosts.filter((data) => data.is_follow === 1);
                posts = filteredPosts.slice(skip, skip + limit);
            }
            else {
                // const filteredPosts = await allPosts.reduce(async (accumulator: Promise<any[]>, post: any) => {
                //     const posts = await accumulator;
                //     let blocked = await BlockUser.findOne({ user_id: auth_id, block_user_id: post.user_id, is_block: true });
                //     if (!blocked) {
                //         posts.push(post);
                //     }
                //     return posts;
                // }, Promise.resolve([]));
                const filteredPosts = yield Promise.all(allPosts.map((post) => __awaiter(this, void 0, void 0, function* () {
                    const blocked = yield BlockUser.findOne({ user_id: auth_id, block_user_id: post.user_id, is_block: true });
                    if (!blocked) {
                        return post;
                    }
                    return null;
                })));
                const finalFilteredPosts = filteredPosts.filter((post) => post !== null);
                posts = finalFilteredPosts.slice(skip, skip + limit);
            }
            yield Promise.all(posts.map((data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let findLike = yield Like.findOne({ post_id: mongoose.Types.ObjectId(data._id), user_id: mongoose.Types.ObjectId(auth_id) });
                    if (findLike === null) {
                        data.is_like = false;
                    }
                    else {
                        if (findLike.is_like === 1) {
                            data.is_like = true;
                        }
                        else {
                            data.is_like = false;
                        }
                    }
                    const mergedComment = Object.assign(Object.assign({}, data.first_comment), data.comment_user);
                    if (data.first_comment != undefined && data.comment_user != undefined) {
                        data.comment_data = mergedComment;
                        delete data.first_comment;
                        delete data.comment_user;
                    }
                }
                catch (e) {
                    console.log('err', e);
                }
            })));
            // console.log(posts.length)
            const notificationscount = yield UserNotification.find({ receiver_id: new mongoose.Types.ObjectId(auth_id), is_read: false });
            return commonUtils_1.default.sendSuccess(req, res, { posts, notificationscount: notificationscount.length }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function postFollowFollowingDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = req.query.user_id;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const total = yield Post.aggregate([
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'post_data'
                    },
                },
                {
                    $match: {
                        'post_data.type': 2,
                        user_id: new mongoose.Types.ObjectId(user_id),
                        is_delete: 0,
                        is_reported: 0
                    },
                },
                { $count: 'totalCount' },
            ]);
            const total_ = total[0] ? total[0].totalCount : 0;
            const userData = yield User.findOne({
                _id: user_id
            });
            if (!userData)
                return commonUtils_1.default.sendError(req, res, { message: "User not exist!" }, 404);
            const userName = userData.firstname + ' ' + userData.lastname;
            const posts = yield Post.aggregate([
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'post_data'
                    },
                },
                {
                    $match: {
                        'post_data.type': 2,
                        user_id: new mongoose.Types.ObjectId(user_id),
                        is_delete: 0,
                        is_reported: 0
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
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'comment_data'
                    },
                },
                { $sort: { createdAt: -1 } },
                { $unwind: { path: "$post_data", preserveNullAndEmptyArrays: true } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        image: 1,
                        createdAt: 1,
                        like_count: {
                            $size: {
                                $filter: {
                                    input: '$like_data',
                                    as: 'like',
                                    cond: { $eq: ['$$like.is_like', 1] }
                                }
                            }
                        },
                        commentCount: { $size: '$comment_data' }
                    }
                }
            ]);
            const followers = yield FollowUnfollow.find({ follow_user_id: new mongoose.Types.ObjectId(user_id), is_follow: 1 });
            const following = yield FollowUnfollow.find({ user_id: new mongoose.Types.ObjectId(user_id), is_follow: 1 });
            const is_follow = yield FollowUnfollow.findOne({ user_id: req.headers.userid, follow_user_id: user_id });
            let isFollow;
            if (is_follow) {
                isFollow = is_follow.is_follow;
            }
            else {
                isFollow = 0;
            }
            return commonUtils_1.default.sendSuccess(req, res, { posts: posts, postCount: total_, followers: followers.length, following: following.length, isFollow: isFollow, user_name: userName, user_image: userData.image, is_subscription: userData.is_subscription }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function userSharedPostList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = req.query.user_id;
            const auth_id = req.headers.userid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const posts = yield Post.aggregate([
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'post_data'
                    },
                },
                {
                    $match: {
                        'post_data.type': 2,
                        user_id: new mongoose.Types.ObjectId(user_id),
                        is_delete: 0,
                        is_reported: 0
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
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user_data'
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'comment_data.user_id',
                        foreignField: '_id',
                        as: 'comment_user'
                    },
                },
                { $sort: { createdAt: -1 } },
                { $unwind: { path: "$post_data", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        image: 1,
                        createdAt: 1,
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
                        user_name: { $concat: ['$user_data.firstname', ' ', '$user_data.lastname'] },
                        user_image: '$user_data.image',
                        // comment_data: {
                        //     $mergeObjects: [
                        //         { comment: { $arrayElemAt: ['$comment_data.comment', 0] } },
                        //         { createdAt: { $arrayElemAt: ['$comment_data.createdAt', 0] } },
                        //         { user_name: { $concat: [{ $arrayElemAt: ['$comment_user.firstname', 0] }, ' ', { $arrayElemAt: ['$comment_user.lastname', 0] }] } },
                        //         { user_image: { $arrayElemAt: ['$comment_user.image', 0] } }
                        //     ],
                        // }
                        // comment_data: {
                        //     $cond: [
                        //         { $eq: [{ $size: '$comment_data' }, 0] }, // Check if comment_data is empty
                        //         '$REMOVE', // If empty, include the empty object
                        //         {
                        //             $mergeObjects: [
                        //                 { comment: { $arrayElemAt: ['$comment_data.comment', 0] } },
                        //                 { createdAt: { $arrayElemAt: ['$comment_data.createdAt', 0] } },
                        //                 { user_id: { $arrayElemAt: ['$comment_user._id', 0] } },
                        //                 { first_name: { $arrayElemAt: ['$comment_user.firstname', 0] } },
                        //                 { last_name: { $arrayElemAt: ['$comment_user.lastname', 0] } },
                        //                 { user_image: { $arrayElemAt: ['$comment_user.image', 0] } }
                        //             ],
                        //         },
                        //     ]
                        // }
                        first_comment: {
                            $cond: [
                                { $eq: [{ $size: '$comment_data' }, 0] },
                                '$REMOVE',
                                {
                                    $mergeObjects: [
                                        { comment: { $arrayElemAt: ['$comment_data.comment', 0] } },
                                        { createdAt: { $arrayElemAt: ['$comment_data.createdAt', 0] } },
                                        { _id: { $arrayElemAt: ['$comment_data._id', 0] } },
                                        { user_id: { $arrayElemAt: ['$comment_data.user_id', 0] } },
                                    ],
                                }
                            ],
                        },
                    }
                },
                {
                    "$lookup": {
                        "from": 'users',
                        "let": { "commentUserId": "$first_comment.user_id" },
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": { "$eq": ["$_id", "$$commentUserId"] }
                                }
                            },
                            {
                                "$project": {
                                    'first_name': '$firstname',
                                    'last_name': '$lastname',
                                    'user_image': '$image',
                                    "_id": 0,
                                }
                            }
                        ],
                        "as": 'comment_user'
                    }
                },
                { $unwind: { path: "$comment_user", preserveNullAndEmptyArrays: true } },
            ]);
            yield Promise.all(posts.map((data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let findLike = yield Like.findOne({ post_id: mongoose.Types.ObjectId(data._id), user_id: mongoose.Types.ObjectId(auth_id) });
                    if (findLike === null) {
                        data.is_like = false;
                    }
                    else {
                        if (findLike.is_like === 1) {
                            data.is_like = true;
                        }
                        else {
                            data.is_like = false;
                        }
                    }
                    const mergedComment = Object.assign(Object.assign({}, data.first_comment), data.comment_user);
                    if (data.first_comment != undefined && data.comment_user != undefined) {
                        data.comment_data = mergedComment;
                        delete data.first_comment;
                        delete data.comment_user;
                    }
                }
                catch (e) {
                    console.log('err', e);
                }
            })));
            return commonUtils_1.default.sendSuccess(req, res, posts, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const findPost = yield Post.findOne({ _id: req.body.post_id });
            if (!findPost)
                return commonUtils_1.default.sendError(req, res, { message: "Post not exist !" }, 404);
            let findNoti = yield UserNotification.find({ "data.id": findPost._id.toString() });
            findPost.is_delete = 1;
            yield findPost.save();
            if (findNoti) {
                yield Promise.all(findNoti === null || findNoti === void 0 ? void 0 : findNoti.map((data) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        data.is_delete = 1;
                        yield data.save();
                    }
                    catch (e) {
                        console.log('err', e);
                    }
                })));
            }
            return commonUtils_1.default.sendSuccess(req, res, { message: "Post deleted successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function createFolder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folderexist = yield SavedPostFolder.findOne({
                user_id: req.headers.userid,
                folder_name: req.body.folder_name,
                is_delete: 0
            });
            if (folderexist) {
                return commonUtils_1.default.sendError(req, res, { message: 'This folder already exist' }, 422);
            }
            let createFolder = yield new SavedPostFolder({
                user_id: req.headers.userid,
                folder_name: req.body.folder_name
            });
            yield createFolder.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Folder created succesfully!", folder_id: createFolder._id }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function deletefolder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Id = req.body.id;
            const folderexist = yield SavedPostFolder.findOne({ _id: new mongoose.Types.ObjectId(Id) });
            if (!folderexist)
                return commonUtils_1.default.sendError(req, res, { message: 'Folder is not found' }, 422);
            folderexist.is_delete = 1;
            yield folderexist.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Folder deleted succesfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function sharedPostList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const total = yield Post.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(auth_id)
                    },
                },
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'shared_post_data'
                    },
                },
                {
                    $match: {
                        'shared_post_data.type': 2,
                    },
                },
                {
                    $count: 'totalCount', // Alias for the count result
                },
            ]);
            const total_ = total[0] ? total[0].totalCount : 0;
            const posts = yield Post.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(auth_id)
                    },
                },
                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'shared_post_data'
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
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'comment_data'
                    },
                },
                {
                    $match: {
                        'shared_post_data.type': 2,
                    },
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            {
                                $addFields: {
                                    page: page,
                                    limit: limit,
                                    total: total_,
                                    hasMoreData: total_ > page * limit ? true : false
                                }
                            }
                        ],
                        data: [
                            { $skip: skip },
                            { $limit: limit },
                            {
                                $project: {
                                    _id: 1,
                                    image: 1,
                                    createdAt: 1,
                                    likeCount: { $size: '$like_data' },
                                    commentCount: { $size: '$comment_data' }
                                }
                            }
                        ]
                    }
                }
            ]);
            return commonUtils_1.default.sendSuccess(req, res, { posts: posts, sharedPostCount: posts[0].data.length }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function recentPostList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const total = yield Post.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(auth_id),
                    },
                },
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'shared_post_data'
                    },
                },
                {
                    $match: {
                        'shared_post_data.type': 1,
                    }
                },
                { $count: 'totalCount' }
            ]);
            const total_ = total[0] ? total[0].totalCount : 0;
            const recentPostList = yield Post.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(auth_id),
                    },
                },
                { $sort: { updatedAt: -1 } },
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'post_id',
                        as: 'shared_post_data'
                    },
                },
                {
                    $match: {
                        'shared_post_data.type': 1,
                    }
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            {
                                $addFields: {
                                    page: page,
                                    limit: limit,
                                    total: total_,
                                    hasMoreData: total_ > page * limit ? true : false
                                }
                            }
                        ],
                        data: [
                            { $skip: skip },
                            { $limit: limit },
                            {
                                $project: {
                                    image: 1
                                }
                            }
                        ]
                    }
                }
            ]);
            return commonUtils_1.default.sendSuccess(req, res, { recentPostList }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function savedFolderList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const total_ = yield SavedPostFolder.find({ user_id: new mongoose.Types.ObjectId(auth_id) }).sort({ created_at: -1 }).countDocuments();
            const posts = yield SavedPostFolder.aggregate([
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(auth_id),
                    },
                },
                {
                    $lookup: {
                        from: 'savedsharedposts',
                        localField: '_id',
                        foreignField: 'folder_id',
                        as: 'saved_post_data',
                    },
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'saved_post_data.post_id',
                        foreignField: '_id',
                        as: 'post_data',
                    },
                },
                {
                    $unwind: {
                        path: "$post_data",
                        preserveNullAndEmptyArrays: true, // Preserve empty folders
                    },
                },
                {
                    $sort: { "post_data.createdAt": -1 } // Sort by createdAt field in descending order
                },
                {
                    $group: {
                        _id: "$_id",
                        folder_name: { $first: "$folder_name" },
                        createdAt: { $first: "$createdAt" },
                        saved_post_data: { $push: "$post_data" }, // Store all post_data in an array
                    }
                },
                {
                    $addFields: {
                        saved_post_count: { $size: "$saved_post_data" }, // Count the number of elements in saved_post_data array
                    }
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            {
                                $addFields: {
                                    page: page,
                                    limit: limit,
                                    total: total_,
                                    hasMoreData: total_ > page * limit ? true : false
                                }
                            }
                        ],
                        data: [
                            { $skip: skip },
                            { $limit: limit },
                            {
                                $project: {
                                    _id: 1,
                                    folder_name: 1,
                                    createdAt: 1,
                                    saved_post_count: { $size: "$saved_post_data" },
                                    latest_post_image: { $arrayElemAt: ["$saved_post_data.image", 0] }
                                }
                            }
                        ]
                    }
                }
            ]);
            return commonUtils_1.default.sendSuccess(req, res, posts, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function recentPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentDate = new Date();
            const formattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";
            yield Post.updateOne({
                _id: req.body.post_id
            }, {
                updatedAt: formattedDate
            });
            return commonUtils_1.default.sendSuccess(req, res, {}, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function savedPostList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folderId = req.query.folderid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            // const total_ = await SavedSharedPost.find({ folder_id: new mongoose.Types.ObjectId(folderId) }).count();
            if (!folderId)
                return commonUtils_1.default.sendError(req, res, { message: "Folder id required!" }, 404);
            const posts = yield SavedSharedPost.aggregate([
                {
                    $match: {
                        folder_id: new mongoose.Types.ObjectId(folderId),
                    },
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'post_id',
                        foreignField: '_id',
                        as: 'post_data',
                    },
                },
                {
                    $match: {
                        'post_data.is_delete': 0,
                    },
                },
                {
                    $unwind: {
                        path: "$post_data",
                        preserveNullAndEmptyArrays: true, // Preserve empty folders
                    },
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        post_id: 1,
                        is_compare: '$post_data.is_compare',
                        createdAt: 1,
                        type: 1,
                        total: 1,
                        post_data_img: '$post_data.image'
                    },
                },
            ]);
            return commonUtils_1.default.sendSuccess(req, res, posts, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function mediaPostList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let auth_id = req.headers.userid;
            let page = parseInt(req.query.page, 10) || 1;
            let limit = parseInt(req.query.limit) || 10;
            let skip = (page - 1) * limit;
            let aggregatePipeline = [];
            let SharedPostTotal = 0;
            if (req.query.type === 'recent') {
                aggregatePipeline = [
                    { $match: { user_id: new mongoose.Types.ObjectId(auth_id), is_delete: 0, is_reported: 0 } },
                    { $sort: { updatedAt: -1 } },
                    {
                        $lookup: {
                            from: 'savedsharedposts',
                            localField: '_id',
                            foreignField: 'post_id',
                            as: 'shared_post_data'
                        },
                    },
                    {
                        $lookup: {
                            from: 'savedsharedposts',
                            localField: 'shared_post_data.folder_id',
                            foreignField: 'folder_id',
                            as: 'folder_data'
                        },
                    },
                    {
                        $lookup: {
                            from: 'savedpostfolders',
                            localField: 'shared_post_data.folder_id',
                            foreignField: '_id',
                            as: 'folder_data_name'
                        },
                    },
                    { $match: { 'shared_post_data.type': 1 } },
                    { $unwind: { path: "$shared_post_data", preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: "$folder_data_name", preserveNullAndEmptyArrays: true } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            image: 1,
                            folder_id: '$shared_post_data.folder_id',
                            saved_post_count: { $size: '$folder_data' },
                            folder_name: '$folder_data_name.folder_name',
                            is_compare: 1
                        }
                    }
                ];
            }
            else if (req.query.type === 'shared') {
                const total = yield Post.aggregate([
                    { $match: { user_id: new mongoose.Types.ObjectId(auth_id), is_delete: 0, is_reported: 0 } },
                    {
                        $lookup: {
                            from: 'savedsharedposts',
                            localField: '_id',
                            foreignField: 'post_id',
                            as: 'shared_post_data'
                        },
                    },
                    { $match: { 'shared_post_data.type': 2 } },
                    { $count: 'totalCount' },
                ]);
                SharedPostTotal = total[0] ? total[0].totalCount : 0;
                aggregatePipeline = [
                    { $match: { user_id: new mongoose.Types.ObjectId(auth_id), is_delete: 0 } },
                    { $sort: { createdAt: -1 } },
                    {
                        $lookup: {
                            from: 'savedsharedposts',
                            localField: '_id',
                            foreignField: 'post_id',
                            as: 'shared_post_data'
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
                            localField: '_id',
                            foreignField: 'post_id',
                            as: 'comment_data'
                        },
                    },
                    { $match: { 'shared_post_data.type': 2 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            _id: 1,
                            image: 1,
                            createdAt: 1,
                            // likeCount: { $size: '$like_data' },
                            // commentCount: { $size: '$comment_data' }
                        }
                    }
                ];
            }
            else if (req.query.type === 'saved') {
                // await Post.updateMany(
                //     { $set: { is_delete: 0 } }
                // );
                // const total_ = await SavedPostFolder.find({ user_id: new mongoose.Types.ObjectId(auth_id) }).sort({ created_at: -1 }).countDocuments();
                aggregatePipeline = [
                    {
                        $match: { user_id: mongoose.Types.ObjectId(auth_id), is_delete: 0 }
                    },
                    {
                        $lookup: {
                            from: 'savedsharedposts',
                            localField: '_id',
                            foreignField: 'folder_id',
                            as: 'saved_post_data'
                        }
                    },
                    {
                        $unwind: { path: "$saved_post_data", preserveNullAndEmptyArrays: true }
                    },
                    {
                        $lookup: {
                            from: 'posts',
                            localField: 'saved_post_data.post_id',
                            foreignField: '_id',
                            as: 'post_data'
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            folder_name: { $first: "$folder_name" },
                            createdAt: { $first: "$createdAt" },
                            saved_post_data: { $push: "$post_data" }
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: 'coverimages',
                            localField: '_id',
                            foreignField: 'folder_id',
                            as: 'cover_image'
                        }
                    },
                    {
                        $unwind: { path: "$cover_image", preserveNullAndEmptyArrays: true }
                    },
                    {
                        $project: {
                            _id: 1,
                            folder_name: 1,
                            createdAt: 1,
                            saved_post_count: {
                                $cond: {
                                    if: { $isArray: "$saved_post_data" },
                                    then: { $size: { $filter: { input: "$saved_post_data", cond: { $ne: ["$$this", []] } } } },
                                    else: 0
                                }
                            },
                            cover_image: '$cover_image.image' // Include the cover_image field
                        }
                    }
                ];
            }
            else {
                return commonUtils_1.default.sendError(req, res, { message: 'Invalid type parameter' }, 400);
            }
            // Execute the aggregation pipeline
            let response;
            if (req.query.type === 'saved') {
                response = yield SavedPostFolder.aggregate(aggregatePipeline);
                yield Promise.all(response === null || response === void 0 ? void 0 : response.map((data) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    try {
                        const postcount = yield SavedSharedPost.aggregate([
                            {
                                $match: { folder_id: mongoose.Types.ObjectId(data._id) }
                            },
                            {
                                $lookup: {
                                    from: 'posts',
                                    localField: 'post_id',
                                    foreignField: '_id',
                                    as: 'post_data'
                                }
                            },
                            {
                                $unwind: '$post_data'
                            },
                            {
                                $match: {
                                    'post_data.is_delete': 0
                                }
                            }
                        ]);
                        // console.log(data._id, total.length, 77777);
                        // findlist?.map(async (post:any) => {
                        //     let findPost = await Post.find({ _id: new mongoose.Types.ObjectId(post.post_id), is_delete: 0 });
                        //     console.log("count Post", findPost.length);
                        // })
                        if (data.cover_image === undefined) {
                            const total = yield SavedSharedPost.aggregate([
                                {
                                    $match: { folder_id: mongoose.Types.ObjectId(data._id) }
                                },
                                {
                                    $lookup: {
                                        from: 'posts',
                                        localField: 'post_id',
                                        foreignField: '_id',
                                        as: 'post_data'
                                    }
                                },
                                {
                                    $unwind: { path: "$post_data", preserveNullAndEmptyArrays: true }
                                },
                                { $sort: { "post_data.createdAt": 1 } },
                                { $limit: 1 }
                            ]);
                            if (postcount.length != 0) {
                                data.cover_image = (_b = (_a = total[0]) === null || _a === void 0 ? void 0 : _a.post_data) === null || _b === void 0 ? void 0 : _b.image;
                            }
                        }
                        data.saved_post_count = postcount.length;
                        return data;
                    }
                    catch (e) {
                        console.log('err', e);
                    }
                })));
            }
            else {
                response = yield Post.aggregate(aggregatePipeline);
            }
            if (req.query.type === 'shared') {
                return commonUtils_1.default.sendSuccess(req, res, { sharedPost: response, sharedPostCount: SharedPostTotal }, 200);
            }
            else {
                return commonUtils_1.default.sendSuccess(req, res, response, 200);
            }
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 400);
        }
    });
}
;
function setCoverImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { post_id, folder_id } = req.body;
            let findPost = yield Post.findOne({ _id: new mongoose.Types.ObjectId(post_id) });
            if (!findPost)
                return commonUtils_1.default.sendError(req, res, { message: 'Post not found!' }, 422);
            let findFolder = yield SavedPostFolder.findOne({ _id: new mongoose.Types.ObjectId(folder_id) });
            if (!findFolder)
                return commonUtils_1.default.sendError(req, res, { message: 'Folder not found!' }, 422);
            const findCoverImage = yield CoverImage.findOne({ user_id: new mongoose.Types.ObjectId(req.headers.userid), folder_id: new mongoose.Types.ObjectId(folder_id) });
            if (findCoverImage) {
                findCoverImage.image = findPost.image;
                yield findCoverImage.save();
            }
            else {
                let setCoverImage = yield new CoverImage({
                    user_id: req.headers.userid,
                    folder_id: req.body.folder_id,
                    image: findPost.image
                });
                yield setCoverImage.save();
            }
            return commonUtils_1.default.sendSuccess(req, res, { message: 'Cover image set successfully!' }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function folderstatuscheck(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Id = req.body.id;
            let flag;
            const folderexist = yield Post.findOne({ _id: new mongoose.Types.ObjectId(Id) });
            if (!folderexist) {
                flag = false;
            }
            else if (folderexist.is_delete == 0) {
                flag = true;
            }
            else {
                flag = false;
            }
            return commonUtils_1.default.sendSuccess(req, res, { flag: flag }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getsuggestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const search = req.query.search;
            const auth_id = req.headers.userid;
            if (search) {
                const users = yield User.aggregate([
                    {
                        $match: {
                            is_delete_account: 0,
                            status: 1
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $regexMatch: { input: "$firstname", regex: search, options: "i" } },
                                    { $regexMatch: { input: "$lastname", regex: search, options: "i" } }
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'followfollowers',
                            localField: '_id',
                            foreignField: 'follow_user_id',
                            pipeline: [
                                {
                                    $match: { $expr: { $eq: ["$user_id", new mongoose.Types.ObjectId(auth_id)] } }
                                },
                            ],
                            as: 'is_follow',
                        },
                    },
                    { $sort: { createdAt: -1 } },
                    { $unwind: { path: "$is_follow", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: 1,
                            image: 1,
                            firstname: 1,
                            lastname: 1,
                            is_follow: { $ifNull: ['$is_follow.is_follow', 0] },
                        }
                    },
                ]);
                return commonUtils_1.default.sendSuccess(req, res, users, 200);
            }
            else {
                const userId = req.headers.userid;
                const followerIds = yield FollowUnfollow.find({ user_id: userId });
                const followerIdList = followerIds.map((follower) => follower.follow_user_id);
                const blockedUsers = yield BlockUser.find({ user_id: userId, is_block: true }).select('block_user_id');
                const blockedUserIds = yield blockedUsers.map((blockedUser) => blockedUser.block_user_id);
                const nonFollowers = yield User.find({
                    $and: [
                        { _id: { $ne: userId } },
                        { _id: { $nin: followerIdList } },
                        { _id: { $nin: blockedUserIds } }
                    ]
                }).select('_id firstname lastname image');
                nonFollowers.sort(() => Math.random() - 0.5);
                const randomNonFollowers = nonFollowers.slice(0, 20);
                return commonUtils_1.default.sendSuccess(req, res, randomNonFollowers, 200);
            }
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
exports.default = {
    createPost,
    savedPost,
    SharedPost,
    getAllPost,
    postFollowFollowingDetails,
    userSharedPostList,
    deletePost,
    createFolder,
    deletefolder,
    folderstatuscheck,
    // sharedPostList,
    // recentPostList,
    // savedFolderList,
    recentPost,
    savedPostList,
    mediaPostList,
    setCoverImage,
    getsuggestion
};
//# sourceMappingURL=postController.js.map