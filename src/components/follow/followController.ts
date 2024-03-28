import commonUtils from "../../utils/commonUtils";
import { Request, Response } from "express";

const FollowUnfollow = require("./followModel");
const User = require("../user/userModel");
const CMS = require("../cms/cmsModel");
const mongoose = require("mongoose");
// import admin from "../../utils/firebaseConfig";
import commoncontroller from "../common/commoncontroller";
import { AppStrings } from "../../utils/appStrings";
const Notification = require('../notification/notificationModel')
var MobileDetect = require('mobile-detect');
const path = require('path');

async function followUnfollow(req: Request, res: Response) {
    try {
        const auth_id = req.headers.userid;
        const findUser = await FollowUnfollow.findOne({ user_id: auth_id, follow_user_id: req.body.follow_user_id });
        let msg;

        if (findUser) {
            findUser.is_follow = findUser.is_follow === 1 ? 0 : 1;
            await findUser.save();

            findUser.is_follow === 1 ? msg = 'Follow' : msg = 'Unfollow';
            if (findUser.is_follow === 1) {
                const user = await User.findOne({ _id: req.body.follow_user_id })
                const senderuser = await User.findOne({ _id: auth_id });
                const username = senderuser.firstname + ' ' + senderuser.lastname
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

                await commoncontroller.sendNotification(auth_id, user, message, type)

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

        } else {
            let follow = await new FollowUnfollow({
                user_id: auth_id,
                follow_user_id: req.body.follow_user_id
            })
            await follow.save();
            msg = 'Follow';

            if (follow.is_follow === 1) {
                const user = await User.findOne({ _id: req.body.follow_user_id })
                const senderuser = await User.findOne({ _id: auth_id });
                const username = senderuser.firstname + ' ' + senderuser.lastname
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

                await commoncontroller.sendNotification(auth_id, user, message, type)
            }
        }

        return commonUtils.sendSuccess(req, res, { message: msg + " successfully!" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function removeFollower(req: Request, res: Response) {
    try {
        const auth_id = req.headers.userid;
        const findUser = await FollowUnfollow.findOne({ user_id: req.body.user_id, follow_user_id: auth_id });
        let msg;

        if (findUser) {
            findUser.is_follow = findUser.is_follow === 1 ? 0 : 1;
            await findUser.save();

            findUser.is_follow === 1 ? msg = 'Follow' : msg = 'Unfollow';

        } else {
            let follow = await new FollowUnfollow({
                user_id: auth_id,
                follow_user_id: req.body.follow_user_id
            })
            await follow.save();
            msg = 'Follow';
        }

        return commonUtils.sendSuccess(req, res, { message: "Remove follower successfully!" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function followersfollowingList(req: Request, res: Response) {
    try {
        const user_id = req.query.user_id;
        const auth_id = req.headers.userid;
        const page: number = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        let datas: any = [];
        if (req.query.type === 'followers') {
            const followers = await FollowUnfollow.aggregate([
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

            datas = await Promise.all(
                followers.map(async (data: any) => {
                    try {
                        const findData = await FollowUnfollow.findOne({
                            user_id: auth_id,
                            follow_user_id: data.user_id
                        })

                        if (findData) {
                            data.isFollow = findData.is_follow;
                        } else {
                            data.isFollow = 0;
                        }

                        const updatedData = {
                            userId: data.user_data._id,
                            user_name: data.user_data.firstname + ' ' + data.user_data.lastname,
                            user_image: data.user_data.image,
                            isFollow: data.isFollow
                        };
                        return updatedData;
                    } catch (e) {
                        console.log('err', e)
                    }
                })
            )
        } else if (req.query.type === 'following') {
            const following = await FollowUnfollow.aggregate([
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

            datas = await Promise.all(
                following.map(async (data: any) => {
                    try {
                        const findData = await FollowUnfollow.findOne({
                            user_id: auth_id,
                            follow_user_id: data.follow_user_id
                        })

                        if (findData) {
                            data.isFollow = findData.is_follow;
                        } else {
                            data.isFollow = 0;
                        }

                        let updatedData: any;
                        if (data?.user_data?._id.toString() != auth_id) {
                            updatedData = {
                                userId: data.user_data._id,
                                user_name: data.user_data.firstname + ' ' + data.user_data.lastname,
                                user_image: data.user_data.image,
                                isFollow: data.isFollow
                            };
                        } else {
                            updatedData = {
                                userId: data.user_data._id,
                                user_name: data.user_data.firstname + ' ' + data.user_data.lastname,
                                user_image: data.user_data.image
                            };
                        }
                        return updatedData;
                    } catch (e) {
                        console.log('err', e)
                    }
                })
            )
        }

        return commonUtils.sendSuccess(req, res, datas, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function followersList(req: Request, res: Response) {
    try {
        const user_id = req.query.user_id;
        const page: number = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Retrieve the total count of followers
        const total = await FollowUnfollow.aggregate([
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
        const followers = await FollowUnfollow.aggregate([
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

        const followersData = await Promise.all(
            followers.map(async (data: any) => {
                try {
                    const findData = await FollowUnfollow.findOne({
                        user_id: data.follow_user_id,
                        follow_user_id: data.user_id
                    })

                    if (findData) {
                        data.isFollow = findData.is_follow;
                    } else {
                        data.isFollow = 0;
                    }

                    const updatedData = {
                        userId: data.user_data._id,
                        userName: data.user_data.firstname + ' ' + data.user_data.lastname,
                        userImage: data.user_data.image,
                        isFollow: data.isFollow
                    };
                    return updatedData;
                } catch (e) {
                    console.log('err', e)
                }
            })
        )

        // Respond with the paginated data and total count
        return commonUtils.sendSuccess(req, res, followersData, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function followingList(req: Request, res: Response) {
    try {
        const user_id = req.query.user_id;
        const page: number = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const total = await FollowUnfollow.aggregate([
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

        const following = await FollowUnfollow.aggregate([
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

        const followingData = await Promise.all(
            following.map(async (data: any) => {
                try {
                    const findData = await FollowUnfollow.findOne({
                        user_id: data.follow_user_id,
                        follow_user_id: data.user_id
                    })

                    if (findData) {
                        data.isFollow = findData.is_follow;
                    } else {
                        data.isFollow = 0;
                    }

                    const updatedData = {
                        userId: data.user_data._id,
                        userName: data.user_data.firstname + ' ' + data.user_data.lastname,
                        userImage: data.user_data.image,
                        isFollow: data.isFollow
                    };
                    return updatedData;
                } catch (e) {
                    console.log('err', e)
                }
            })
        )
        return commonUtils.sendSuccess(req, res, followingData, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function getTerms(req: Request, res: Response) {
    try {
        const data = await CMS.findOne().select('terms_condition');
        return commonUtils.sendAdminSuccess(req, res, data.terms_condition, 200);
    } catch (err) {
        return commonUtils.sendError(req, res, { message: "Something went wrong" });
    }
}

async function getPrivacy(req: Request, res: Response) {
    try {
        const data = await CMS.findOne().select('privacy_policy');
        return commonUtils.sendAdminSuccess(req, res, data.privacy_policy, 200);
    } catch (err) {
        return commonUtils.sendError(req, res, { message: "Something went wrong" });
    }
}

async function getTermsAndPrivacy(req: Request, res: Response) {
    try {
        let data: any = {};
        if (req.query.type === "terms") {
            data = await CMS.findOne().select('terms_condition');
        } else if (req.query.type === "privacy") {
            data = await CMS.findOne().select('privacy_policy');
        }
        return commonUtils.sendSuccess(req, res, data, 200);
    } catch (err) {
        return commonUtils.sendError(req, res, { message: "Something went wrong" });
    }
}

const shareProfile = async (req: Request, res: Response) => {
    let md = new MobileDetect(req.headers['user-agent']);
    try {
        let code = req.query.post_id;
        res.render(path.join(__dirname + '/views/index.ejs'), { isiOS: md.is('iPhone'), code: code });
    } catch (error) {
        console.log("shareProfile", error)
        return commonUtils.sendError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 422);
    }
}

async function getRefundPolicy(req: Request, res: Response) {
    try {
        const data = await CMS.findOne().select('refund_policy');
        return commonUtils.sendAdminSuccess(req, res, data.refund_policy, 200);
    } catch (err) {
        return commonUtils.sendError(req, res, { message: "Something went wrong" });
    }
}

async function getEula(req: Request, res: Response) {
    try {
        const data = await CMS.findOne().select('eula');
        return commonUtils.sendAdminSuccess(req, res, data.eula, 200);
    } catch (err) {
        return commonUtils.sendError(req, res, { message: "Something went wrong" });
    }
}

export default {
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
}