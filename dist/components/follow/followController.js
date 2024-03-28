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
const FollowUnfollow = require("./followModel");
const User = require("../user/userModel");
const CMS = require("../cms/cmsModel");
const mongoose = require("mongoose");
// import admin from "../../utils/firebaseConfig";
const commoncontroller_1 = __importDefault(require("../common/commoncontroller"));
const appStrings_1 = require("../../utils/appStrings");
const Notification = require('../notification/notificationModel');
var MobileDetect = require('mobile-detect');
const path = require('path');
function followUnfollow(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const findUser = yield FollowUnfollow.findOne({ user_id: auth_id, follow_user_id: req.body.follow_user_id });
            let msg;
            if (findUser) {
                findUser.is_follow = findUser.is_follow === 1 ? 0 : 1;
                yield findUser.save();
                findUser.is_follow === 1 ? msg = 'Follow' : msg = 'Unfollow';
                if (findUser.is_follow === 1) {
                    const user = yield User.findOne({ _id: req.body.follow_user_id });
                    const senderuser = yield User.findOne({ _id: auth_id });
                    const username = senderuser.firstname + ' ' + senderuser.lastname;
                    const type = 1;
                    const message = {
                        notification: {
                            title: "Follow User",
                            body: username + "  started follow you."
                        },
                        data: {
                            id: String(senderuser._id),
                            type: String(1)
                        }
                    };
                    yield commoncontroller_1.default.sendNotification(auth_id, user, message, type);
                    // const notification = new Notification();
                    // notification.title = message.notification.title;
                    // notification.message = message.notification.body;
                    // notification.sender_id = auth_id;
                    // notification.receiver_id = user._id
                    // await notification.save();
                    // if (user.pushToken != null) {
                    //     await admin.messaging().sendToDevice(user.pushToken, message).then((response: any) => {
                    //         console.log("success", response.results)
                    //         //return commonUtils.sendSuccess(req, res, { message: "success" }, 200);
                    //     }).catch((err: any) => {
                    //         return commonUtils.sendError(req, res, { message: err.message }, 409);
                    //     });
                    // }
                }
            }
            else {
                let follow = yield new FollowUnfollow({
                    user_id: auth_id,
                    follow_user_id: req.body.follow_user_id
                });
                yield follow.save();
                msg = 'Follow';
                if (follow.is_follow === 1) {
                    const user = yield User.findOne({ _id: req.body.follow_user_id });
                    const senderuser = yield User.findOne({ _id: auth_id });
                    const username = senderuser.firstname + ' ' + senderuser.lastname;
                    const type = 1;
                    const message = {
                        notification: {
                            title: "Follow User",
                            body: username + " started follow you."
                        },
                        data: {
                            id: String(senderuser._id),
                            type: String(1)
                        }
                    };
                    yield commoncontroller_1.default.sendNotification(auth_id, user, message, type);
                }
            }
            return commonUtils_1.default.sendSuccess(req, res, { message: msg + " successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function removeFollower(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auth_id = req.headers.userid;
            const findUser = yield FollowUnfollow.findOne({ user_id: req.body.user_id, follow_user_id: auth_id });
            let msg;
            if (findUser) {
                findUser.is_follow = findUser.is_follow === 1 ? 0 : 1;
                yield findUser.save();
                findUser.is_follow === 1 ? msg = 'Follow' : msg = 'Unfollow';
            }
            else {
                let follow = yield new FollowUnfollow({
                    user_id: auth_id,
                    follow_user_id: req.body.follow_user_id
                });
                yield follow.save();
                msg = 'Follow';
            }
            return commonUtils_1.default.sendSuccess(req, res, { message: "Remove follower successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function followersfollowingList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = req.query.user_id;
            const auth_id = req.headers.userid;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            let datas = [];
            if (req.query.type === 'followers') {
                const followers = yield FollowUnfollow.aggregate([
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
                            follow_user_id: new mongoose.Types.ObjectId(user_id),
                            is_follow: 1,
                            // user_id: {
                            //     $ne: new mongoose.Types.ObjectId(auth_id)
                            // }
                        },
                    },
                    { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                ])
                    .skip(skip)
                    .limit(limit);
                datas = yield Promise.all(followers.map((data) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const findData = yield FollowUnfollow.findOne({
                            user_id: auth_id,
                            follow_user_id: data.user_id
                        });
                        if (findData) {
                            data.isFollow = findData.is_follow;
                        }
                        else {
                            data.isFollow = 0;
                        }
                        const updatedData = {
                            userId: data.user_data._id,
                            user_name: data.user_data.firstname + ' ' + data.user_data.lastname,
                            user_image: data.user_data.image,
                            isFollow: data.isFollow
                        };
                        return updatedData;
                    }
                    catch (e) {
                        console.log('err', e);
                    }
                })));
            }
            else if (req.query.type === 'following') {
                const following = yield FollowUnfollow.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'follow_user_id',
                            foreignField: '_id',
                            as: 'user_data'
                        },
                    },
                    {
                        $match: {
                            user_id: new mongoose.Types.ObjectId(user_id),
                            is_follow: 1
                        },
                    },
                    { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                ])
                    .skip(skip)
                    .limit(limit);
                datas = yield Promise.all(following.map((data) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    try {
                        const findData = yield FollowUnfollow.findOne({
                            user_id: auth_id,
                            follow_user_id: data.follow_user_id
                        });
                        if (findData) {
                            data.isFollow = findData.is_follow;
                        }
                        else {
                            data.isFollow = 0;
                        }
                        let updatedData;
                        if (((_a = data === null || data === void 0 ? void 0 : data.user_data) === null || _a === void 0 ? void 0 : _a._id.toString()) != auth_id) {
                            updatedData = {
                                userId: data.user_data._id,
                                user_name: data.user_data.firstname + ' ' + data.user_data.lastname,
                                user_image: data.user_data.image,
                                isFollow: data.isFollow
                            };
                        }
                        else {
                            updatedData = {
                                userId: data.user_data._id,
                                user_name: data.user_data.firstname + ' ' + data.user_data.lastname,
                                user_image: data.user_data.image
                            };
                        }
                        return updatedData;
                    }
                    catch (e) {
                        console.log('err', e);
                    }
                })));
            }
            return commonUtils_1.default.sendSuccess(req, res, datas, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function followersList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = req.query.user_id;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            // Retrieve the total count of followers
            const total = yield FollowUnfollow.aggregate([
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
                        follow_user_id: new mongoose.Types.ObjectId(user_id),
                        is_follow: 1
                    },
                },
                { $count: 'totalCount' },
            ]);
            const total_ = total[0] ? total[0].totalCount : 0;
            // Fetch the followers for the specified page and limit
            const followers = yield FollowUnfollow.aggregate([
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
                        follow_user_id: new mongoose.Types.ObjectId(user_id),
                        is_follow: 1
                    },
                },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
            ])
                .skip(skip)
                .limit(limit);
            const followersData = yield Promise.all(followers.map((data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const findData = yield FollowUnfollow.findOne({
                        user_id: data.follow_user_id,
                        follow_user_id: data.user_id
                    });
                    if (findData) {
                        data.isFollow = findData.is_follow;
                    }
                    else {
                        data.isFollow = 0;
                    }
                    const updatedData = {
                        userId: data.user_data._id,
                        userName: data.user_data.firstname + ' ' + data.user_data.lastname,
                        userImage: data.user_data.image,
                        isFollow: data.isFollow
                    };
                    return updatedData;
                }
                catch (e) {
                    console.log('err', e);
                }
            })));
            // Respond with the paginated data and total count
            return commonUtils_1.default.sendSuccess(req, res, followersData, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function followingList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = req.query.user_id;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const total = yield FollowUnfollow.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'follow_user_id',
                        foreignField: '_id',
                        as: 'user_data'
                    },
                },
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(user_id),
                        is_follow: 1
                    },
                },
                { $count: 'totalCount' },
            ]);
            const total_ = total[0] ? total[0].totalCount : 0;
            const following = yield FollowUnfollow.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'follow_user_id',
                        foreignField: '_id',
                        as: 'user_data'
                    },
                },
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(user_id),
                        is_follow: 1
                    },
                },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
            ])
                .skip(skip)
                .limit(limit);
            const followingData = yield Promise.all(following.map((data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const findData = yield FollowUnfollow.findOne({
                        user_id: data.follow_user_id,
                        follow_user_id: data.user_id
                    });
                    if (findData) {
                        data.isFollow = findData.is_follow;
                    }
                    else {
                        data.isFollow = 0;
                    }
                    const updatedData = {
                        userId: data.user_data._id,
                        userName: data.user_data.firstname + ' ' + data.user_data.lastname,
                        userImage: data.user_data.image,
                        isFollow: data.isFollow
                    };
                    return updatedData;
                }
                catch (e) {
                    console.log('err', e);
                }
            })));
            return commonUtils_1.default.sendSuccess(req, res, followingData, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getTerms(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield CMS.findOne().select('terms_condition');
            return commonUtils_1.default.sendAdminSuccess(req, res, data.terms_condition, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: "Something went wrong" });
        }
    });
}
function getPrivacy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield CMS.findOne().select('privacy_policy');
            return commonUtils_1.default.sendAdminSuccess(req, res, data.privacy_policy, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: "Something went wrong" });
        }
    });
}
function getTermsAndPrivacy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = {};
            if (req.query.type === "terms") {
                data = yield CMS.findOne().select('terms_condition');
            }
            else if (req.query.type === "privacy") {
                data = yield CMS.findOne().select('privacy_policy');
            }
            return commonUtils_1.default.sendSuccess(req, res, data, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: "Something went wrong" });
        }
    });
}
const shareProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let md = new MobileDetect(req.headers['user-agent']);
    try {
        let code = req.query.post_id;
        res.render(path.join(__dirname + '/views/index.ejs'), { isiOS: md.is('iPhone'), code: code });
    }
    catch (error) {
        console.log("shareProfile", error);
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.SOMETHING_WENT_WRONG }, 422);
    }
});
function getRefundPolicy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield CMS.findOne().select('refund_policy');
            return commonUtils_1.default.sendAdminSuccess(req, res, data.refund_policy, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: "Something went wrong" });
        }
    });
}
function getEula(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield CMS.findOne().select('eula');
            return commonUtils_1.default.sendAdminSuccess(req, res, data.eula, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: "Something went wrong" });
        }
    });
}
exports.default = {
    followUnfollow,
    followersfollowingList,
    getTerms,
    getPrivacy,
    removeFollower,
    getTermsAndPrivacy,
    shareProfile,
    getRefundPolicy,
    getEula
    // followersList,
    // followingList,
};
//# sourceMappingURL=followController.js.map