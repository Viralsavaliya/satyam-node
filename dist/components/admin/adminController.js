"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const commonUtils_1 = __importStar(require("../../utils/commonUtils"));
const appStrings_1 = require("../../utils/appStrings");
const index_1 = __importDefault(require("../../auth/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const commoncontroller_1 = __importDefault(require("../common/commoncontroller"));
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const Admin = require("./models/adminModel");
const Work = require("./models/workModel");
const User = require("../user/userModel");
const HunterTip = require("./models/huntertipsModel");
const BIL = require("./models/huntertipsModel");
const Techniques = require("./models/techniquesModel");
const Post = require("../post/postModel");
const Tutorial = require("./models/tutorialsModel");
const Item = require("./models/tutorialsModel");
const PromoCode = require("./models/promocodeModel");
const SavedPostFolder = require("../post/savedPostFolderModel");
const Subscription = require("../subscription/subscriptionModel");
const UserSubscription = require("../subscription/userSubscriptionModel");
const Notification = require("../notification/notificationModel");
const supportTicket = require("../supportTicket/supportTicketModel");
const reportPost = require("../report/reportPostModel");
const reportUser = require("../report/reportUserModel");
const multer = require("multer");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            status: 1,
        });
        // hash password
        const salt = yield bcrypt.genSalt(10);
        admin.password = yield bcrypt.hash(admin.password, salt);
        yield admin.save();
        return commonUtils_1.default.sendAdminSuccess(req, res, { message: "Admin Register successfully", id: admin._id }, 200);
    });
}
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.userid) || "";
    const pipline = [
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(adminId),
            },
        },
        {
            $project: {
                _id: 1,
                name: "$name",
                id: "$_id",
                email: "$email",
                mobile: "$mobile",
                image: "$image"
            },
        },
    ];
    const admin = yield Admin.aggregate(pipline);
    return commonUtils_1.default.sendAdminSuccess(req, res, admin.length ? admin[0] : {});
});
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.body.email ? req.body.email : "";
            const password = req.body.password;
            const social_id = req.body.social_id;
            const login_type = req.body.login_type;
            if (!email)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.EMAIL_MOBILE_REQUIRED }, 409);
            // const admin = await Admin.find();
            // console.log(admin);
            // const user = await Admin.findOne({ email: email });
            const user = yield Admin.findOne({ email: email }); // Increase timeout to 20 seconds (20000 milliseconds)
            if (!user && social_id)
                return commonUtils_1.default.sendSuccess(req, res, { is_register: false }, 200); //need to reg
            if (!user)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_CREDENTIAL_DOES_NOT_MATCH }, 409);
            user.pushToken = req.body.pushToken || null;
            // await user.save();
            if (social_id && user.social_id == null) {
                user.social_id = social_id ? social_id : user.social_id;
                user.login_type = login_type ? login_type : user.login_type;
                yield user.save();
            }
            if (social_id && user.social_id != social_id) {
                return commonUtils_1.default.sendError(req, res, { message: "sorry You are not owner of this account!" }, 409);
            }
            // if (user.status != 1) return commonUtils.sendError(req, res, { message: AppStrings.USER_DEACTIVATE }, 409);
            // if (!user.is_verify) return commonUtils.sendError(req, res, { message: "verify your email befor login!" }, 409);
            // let hostname = req.headers.host;
            // query.is_verify = true;
            // const isVerified = await User.findOne(query);
            // if (!isVerified) {
            //     await SendEmailVarification(email, user.fullname, hostname);
            //     return commonUtils.sendError(req, res, { message: "User is not varified!" }, 409);
            // }
            console.log(password, user.password);
            if (password) {
                const valid_password = yield bcrypt.compare(password, user.password);
                if (!valid_password) {
                    res.clearCookie("accessToken");
                    res.clearCookie("refreshToken");
                    return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_PASSWORD }, 409);
                }
            }
            const response_ = yield index_1.default.adminLogin(user._id, user.createdAt);
            res.cookie("accessToken", response_.accessToken, {
                maxAge: 900000,
                httpOnly: true,
            });
            res.cookie("refreshToken", response_.refreshToken, {
                maxAge: 900000,
                httpOnly: true,
            });
            const token = {
                accessToken: response_.accessToken,
                refreshToken: response_.refreshToken,
                user,
            }; // user is already reg no need to reg
            return commonUtils_1.default.sendSuccess(req, res, token, 200);
        }
        catch (err) {
            console.log(err);
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const adminId = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.userid;
    console.log(req === null || req === void 0 ? void 0 : req.body, "adminId");
    const admin = yield Admin.findById(adminId);
    if (!admin)
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.ADMIN_NOT_FOUND }, 409);
    const { image } = req.body;
    const name = ((_c = req.body) === null || _c === void 0 ? void 0 : _c.name) || admin.name;
    const email = ((_d = req.body) === null || _d === void 0 ? void 0 : _d.email) || admin.email;
    const mobile = ((_e = req.body) === null || _e === void 0 ? void 0 : _e.mobile) || admin.mobile;
    const images = ((_f = req.body) === null || _f === void 0 ? void 0 : _f.image) || admin.image;
    admin.name = name;
    admin.email = email;
    // admin.mobile = mobile;
    if (image) {
        if (admin.image) {
            var filename = path === null || path === void 0 ? void 0 : path.basename(admin === null || admin === void 0 ? void 0 : admin.image);
            if (fs.existsSync("uploads/admin/" + filename) && filename != "") {
                fs.unlinkSync("uploads/admin/" + filename);
                admin.image = images;
            }
        }
    }
    yield admin.save();
    yield admin.updateOne({ name: name, email: email, mobile: mobile, image: image }).exec();
    return commonUtils_1.default.sendSuccess(req, res, { message: appStrings_1.AppStrings.PROFILE_UPDATED }, 200);
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const adminId = (_g = req === null || req === void 0 ? void 0 : req.headers) === null || _g === void 0 ? void 0 : _g.userid;
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;
    const admin = yield Admin.findById(adminId);
    if (!admin)
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_NOT_FOUND }, 409);
    const valid_password = yield bcrypt.compare(old_password, admin.password);
    if (!valid_password)
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.OLD_PASSWORD_INVALID }, 409);
    const salt = yield bcrypt.genSalt(10);
    admin.password = yield bcrypt.hash(new_password, salt);
    yield admin.updateOne({ password: admin.password }).exec();
    return commonUtils_1.default.sendSuccess(req, res, { message: appStrings_1.AppStrings.PASSWORD_CHANGED }, 200);
});
function dashboard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const TotalUser = yield User.countDocuments();
            const SubscriberUser = yield User.countDocuments({ is_subscription: 1 });
            const FreeUser = yield User.countDocuments({ is_subscription: 0 });
            const price = yield Subscription.findOne();
            const usersubsctiptiontotal = yield UserSubscription.countDocuments({ payment_status: 1, coupon_id: { $ne: null } });
            const usersubsctiptiontotalall = yield UserSubscription.countDocuments({ payment_status: 1, coupon_id: null });
            const discountPercentage = 10; // 10% discount
            const discount = ((price === null || price === void 0 ? void 0 : price.price) * discountPercentage) / 100;
            const discountedPrice = (price === null || price === void 0 ? void 0 : price.price) - discount;
            const totalpayment = (usersubsctiptiontotal * discountedPrice) + (usersubsctiptiontotalall * (price === null || price === void 0 ? void 0 : price.price));
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            const usersubsctiptiontotaltoday = yield UserSubscription.countDocuments({
                payment_status: 1, coupon_id: { $ne: null }, createdAt: { $gte: startOfDay, $lt: endOfDay }
            });
            const usersubsctiptiontotalalltoday = yield UserSubscription.countDocuments({
                payment_status: 1, coupon_id: null, createdAt: { $gte: startOfDay, $lt: endOfDay }
            });
            const discountPercentagetoday = 10;
            const discounttoday = ((price === null || price === void 0 ? void 0 : price.price) * discountPercentagetoday) / 100;
            const discountedPricetoday = (price === null || price === void 0 ? void 0 : price.price) - discounttoday;
            const totalpaymenttoday = usersubsctiptiontotaltoday * discountedPricetoday + usersubsctiptiontotalalltoday * (price === null || price === void 0 ? void 0 : price.price);
            const supportticket = yield supportTicket.countDocuments({ status: 1, });
            const todaytotaluser = yield User.countDocuments({ createdAt: { $gte: startOfDay, $lt: endOfDay } });
            const TodayPaidUser = usersubsctiptiontotaltoday + usersubsctiptiontotalalltoday;
            const transactionhistory = yield UserSubscription.countDocuments();
            const user = {
                TotalUser,
                FreeUser,
                totalpayment,
                totalpaymenttoday,
                SubscriberUser,
                supportticket,
                todaytotaluser,
                TodayPaidUser,
                transactionhistory
            };
            return res.status(200).json({ user });
        }
        catch (error) {
            console.error("Error fetching status-wise count:", error);
            return res.status(500).json({ error: "Failed to fetch status-wise count" });
        }
    });
}
const userList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(1111);
    const { serach } = req.query;
    console.log(serach);
    const user = yield User.find({
        $or: [
            { name: new RegExp(serach, "i") },
            { mobile: new RegExp(serach, "i") },
            { mobile2: new RegExp(serach, "i") },
            { carnumber: new RegExp(serach, "i") },
            { email: new RegExp(serach, "i") },
        ],
    })
        .sort({ createdAt: "desc" });
    return commonUtils_1.default.sendSuccess(req, res, user);
});
const allUserList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.find().select("_id firstName lastName companyName email mobile type");
    return commonUtils_1.default.sendSuccess(req, res, user);
});
const brokerList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.find({
        type: 1,
        $or: [{ mainUserId: { $exists: false } }, { mainUserId: null }],
    })
        .select("_id firstName lastName companyName mcNumber email mobile isApprove type createdAt")
        .sort({ createdAt: "desc" });
    return commonUtils_1.default.sendSuccess(req, res, user);
});
const changeUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid, status } = req.body;
    try {
        const user = yield User.findOne({ _id: userid });
        if (!user) {
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_NOT_FOUND }, 404);
        }
        let newStatus;
        switch (status) {
            case 0:
                newStatus = 1;
                break;
            case 1:
                newStatus = 0;
                break;
            default:
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_STATUS }, 400);
        }
        // Update the user's isApprove status
        user.status = newStatus;
        yield user.save();
        return commonUtils_1.default.sendSuccess(req, res, user);
    }
    catch (error) {
        console.error("Error updating user approval status:", error);
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.SOMETHING_WENT_WRONG }, 500);
    }
});
const carrierSubUserList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.id;
    const subUser = yield User.find({ mainUserId: userId }).select("_id firstName lastName companyName dotNumber mcNumber email mobile type createdAt");
    if (!subUser) {
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.USER_NOT_FOUND }, 409);
    }
    return commonUtils_1.default.sendSuccess(req, res, subUser);
});
const WorkList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Work.find().select("_id humanimage deerimage description createdAt");
    return commonUtils_1.default.sendSuccess(req, res, user);
});
const CreateWork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { humanimage, deerimage, description } = req.body;
        let work = yield new Work({
            humanimage,
            deerimage,
            description,
        });
        yield work.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: "Work created successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const Updatework = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const workid = (_h = req === null || req === void 0 ? void 0 : req.query) === null || _h === void 0 ? void 0 : _h.id;
    console.log(workid);
    const work = yield Work.findById(workid);
    if (!work)
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.WORK_NOT_FOUND }, 409);
    try {
        const { humanimage, deerimage, description } = req.body;
        const humanimg = humanimage || work.humanimage;
        const deerimg = deerimage || work.deerimage;
        const deer = description || work.description;
        if (humanimage) {
            var filename = path.basename(work.humanimage);
            if (fs.existsSync("uploads/admin/" + filename) && filename != "") {
                fs.unlinkSync("uploads/admin/" + filename);
                work.humanimage = humanimg;
            }
        }
        if (deerimage) {
            var filename = path.basename(work.deerimage);
            if (fs.existsSync("uploads/admin/" + filename) && filename != "") {
                fs.unlinkSync("uploads/admin/" + filename);
                work.deerimage = deerimg;
            }
        }
        work.humanimage = humanimg;
        work.deerimage = deerimg;
        if (!(humanimage || deerimage)) {
            work.description = deer;
        }
        yield work.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: "Work updated successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const Deletework = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const deleteworkid = (_j = req === null || req === void 0 ? void 0 : req.query) === null || _j === void 0 ? void 0 : _j.id;
        const deletedWork = yield Work.findByIdAndDelete(deleteworkid);
        if (!deletedWork) {
            return res.status(404).json({ message: appStrings_1.AppStrings.WORK_NOT_FOUND });
        }
        return commonUtils_1.default.sendSuccess(req, res, { message: "Work deleted successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const getSharedPostList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.id;
        const posts = yield Post.aggregate([
            {
                $match: {
                    user_id: new mongoose_1.default.Types.ObjectId(user_id)
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
        return commonUtils_1.default.sendSuccess(req, res, { posts: posts, sharedPostCount: posts.length }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const getSavedPostList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.id;
        const post = yield Post.aggregate([
            {
                $match: {
                    is_delete: 0
                },
            },
            {
                $match: {
                    user_id: new mongoose_1.default.Types.ObjectId(user_id),
                },
            },
            {
                $lookup: {
                    from: 'savedsharedposts',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'saved_post_data'
                },
            },
            {
                $match: {
                    'saved_post_data.type': 1,
                },
            },
            {
                $project: {
                    image: 1,
                    createdAt: 1
                }
            }
        ]);
        return commonUtils_1.default.sendSuccess(req, res, post, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const bilList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    // const user = await BIL.find({userId: new mongoose.Types.ObjectId(id)}).sort({ createdAt: -1 });
    const user = yield BIL.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user_data',
            },
        },
        {
            $unwind: {
                path: "$user_data",
                preserveNullAndEmptyArrays: true,
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $project: {
                _id: 1,
                user: '$user_data',
                Allitem: 1,
                billnumber: 1,
                createdAt: 1,
                millage: 1
            },
        },
    ]);
    return commonUtils_1.default.sendSuccess(req, res, user);
});
function getFacilityUniqId() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let total_facility = yield BIL.count();
            total_facility = total_facility + 1;
            let id = "000000";
            let generatedId = (id + total_facility).slice(-id.length);
            return resolve(generatedId);
        }));
    });
}
// const createBil = async (req: any, res: Response) => {
//   try {
//     console.log(req.body);
//     const { userId,bil } =
//       req.body;
//       let uniqeId: any = await getFacilityUniqId()
//     let huntertip = await new BIL({
//       userId,
//       Allitem:bil,
//       billnumber: uniqeId
//     });
//     await huntertip.save();
//     const ejsTemplate = await ejs.renderFile(
//       path.join(__dirname, '../pdf.ejs'),
//       huntertip
//     );
//     // Create PDF from the rendered HTML
//     const pdfOptions = { format: 'Letter' }; // Adjust options as needed
//     const pdfBuffer = await new Promise((resolve, reject) => {
//       pdf.create(ejsTemplate, pdfOptions).toBuffer((err: any, buffer: any) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(buffer);
//         }
//       });
//     });
//     // Set the response headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${uniqeId}.pdf`);
//     // Send the PDF buffer as the response
//     // res.send(pdfBuffer);
//     // Trigger the download using res.download
//     // res.download(pdfBuffer, `${uniqeId}.pdf`);
//     return commonUtils.sendSuccess(
//       req,
//       res,
//       { message: "Bil created successfully!" },
//       200
//     );
//   } catch (err: any) {
//     return commonUtils.sendError(req, res, { message: err.message }, 409);
//   }
// };
// const createBil = async (req: any, res: Response) => {
//   try {
//     console.log(req.body);
//     const { userId, bil } = req.body;
//     const uniqeId: any = await getFacilityUniqId();
//     const huntertip = new BIL({
//       userId,
//       Allitem: bil,
//       billnumber: uniqeId,
//     });
//     await huntertip.save();
//     const ejsTemplate = await ejs.renderFile(
//       path.join(__dirname, '../pdf.ejs'),
//       huntertip
//     );
//   //   <!-- <ul>
//   //   <% bil.checkedItems.forEach(item => { %>
//   //     <li><%= item.item %> - <%= item.amount %></li>
//   //   <% }) %>
//   // </ul> -->
//   // <!-- <p>Total: <%= bil.total %></p> -->
//     // Create PDF from the rendered HTML
//     const pdfOptions = { format: 'Letter' };
//     const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
//       pdf.create(ejsTemplate, pdfOptions).toBuffer((err: any, buffer: any) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(buffer);
//         }
//       });
//     });
//     // Save the PDF buffer to a file
//     const pdfFilePath = path.join(__dirname, `${uniqeId}.pdf`);
//     await fs.writeFile(pdfFilePath, pdfBuffer);
//     // Set the response headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${uniqeId}.pdf`);
//     // Trigger the download using res.download with the file path
//     res.download(pdfFilePath, `${uniqeId}.pdf`, (err) => {
//       if (err) {
//         // Handle any download errors here
//         console.error('Error during PDF download:', err);
//       } else {
//         // Delete the temporary PDF file after download
//         fs.unlink(pdfFilePath);
//       }
//     });
//     return commonUtils.sendSuccess(
//       req,
//       res,
//       { message: 'Bil created successfully!' },
//       200
//     );
//   } catch (err: any) {
//     console.error('Error creating Bil:', err);
//     return commonUtils.sendError(req, res, { message: err.message }, 409);
//   }
// };
const createBil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { userId, bil, millage } = req.body;
        console.log(req.body);
        const uniqeId = yield getFacilityUniqId();
        const huntertip = new BIL({
            userId,
            Allitem: bil,
            billnumber: uniqeId,
            millage
        });
        yield huntertip.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: 'Bil created successfully!' }, 200);
    }
    catch (err) {
        console.error('Error creating Bil:', err);
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
function pdfDownload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const logo = process.env.LOGO_PATH_LOCAL + process.env.LOGO_PATH;
            console.log(logo);
            const location_file = path.join(__dirname, '../pdf.ejs');
            const data = req.body;
            data.date_time = moment(data === null || data === void 0 ? void 0 : data.createdAt).format("DD MMM hh:mm:A");
            // Render the EJS template to HTML (replace this with your logic)
            const htmlContent = yield ejs.renderFile(location_file, { data: data, logo: logo });
            // Set PDF options
            const options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            // Convert HTML to PDF
            pdf.create(htmlContent, options).toBuffer((err, pdfBuffer) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error("Error creating PDF:", err);
                    return res.status(500).send({ message: "Failed to generate PDF." });
                }
                // Set headers
                res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
                res.setHeader("Content-Type", "application/pdf");
                // Set Content-Length header
                res.setHeader("Content-Length", pdfBuffer.length);
                // Send the PDF as response
                res.send(pdfBuffer);
            }));
        }
        catch (err) {
            console.error("Error in pdfDownload:", err);
            return res.status(500).send({ message: "Internal Server Error." });
        }
    });
}
const updateBil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const editbil = yield BIL.findOne({ _id: new mongoose_1.default.Types.ObjectId(id) });
        if (!editbil) {
            return commonUtils_1.default.sendError(req, res, { message: "Bil not found" }, 404);
        }
        const { bil, millage } = req.body;
        console.log(req.body);
        editbil.Allitem = bil,
            editbil.millage = millage,
            yield editbil.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: "Bil update successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const changestatusHuntertip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const { status } = req.body;
    try {
        const hunter = yield HunterTip.findOne({ _id: id });
        if (!hunter) {
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.HUNTER_NOT_FOUND }, 404);
        }
        let newStatus;
        switch (status) {
            case 0:
                newStatus = 1;
                break;
            case 1:
                newStatus = 0;
                break;
            default:
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_STATUS }, 400);
        }
        // Update the user's isApprove status
        hunter.status = newStatus;
        yield hunter.save();
        return commonUtils_1.default.sendSuccess(req, res, hunter);
    }
    catch (error) {
        console.error("Error updating user approval status:", error);
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.SOMETHING_WENT_WRONG }, 500);
    }
});
const UpdathunterTip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.query;
    const hunter = yield HunterTip.findById(id);
    console.log(hunter);
    if (!hunter)
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.HUNTERTIP_NOT_FOUND }, 409);
    try {
        const { title, description, image } = req.body;
        const Title = title || hunter.title;
        const Description = description || hunter.description;
        const Image = image || hunter.image;
        if (image) {
            if (hunter.image) {
                var filename = path === null || path === void 0 ? void 0 : path.basename(hunter === null || hunter === void 0 ? void 0 : hunter.image);
                if (fs.existsSync("uploads/admin/" + filename) && filename != "") {
                    fs.unlinkSync("uploads/admin/" + filename);
                }
            }
        }
        hunter.image = Image;
        hunter.title = Title;
        hunter.description = Description;
        yield hunter.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: "Hunter Tip updated successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const getTutorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Item.find().sort({ createdAt: "desc" });
    return commonUtils_1.default.sendSuccess(req, res, user);
});
const CreateTutorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item, amount } = req.body;
        let items = yield new Item({
            item,
            amount,
        });
        yield items.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: "Item created successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
function changetutorialStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const support = yield Tutorial.findOne({ _id: req.params.id });
            support.status = support.status == 0 ? 1 : 0;
            yield support.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "status change successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function updateTutorial(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { item, amount } = req.body;
            const items = yield Item.findOne({ _id: req.query.id });
            items.item = item;
            items.amount = amount;
            yield items.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Item update successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    let destination = "./uploads/admin";
    const image_ = multer({
        storage: (0, commonUtils_1.commonFileStorage)(destination),
        fileFilter: commonUtils_1.fileFilter,
    }).single("image");
    image_(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        if (!req.file)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.IMAGE_NOT_FOUND }, 409);
        const image_name = req.file.filename;
        return commonUtils_1.default.sendSuccess(req, res, {
            file_name: image_name,
        }, 200);
    }));
});
const purchaseplan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchase = yield Subscription.find();
        return commonUtils_1.default.sendSuccess(req, res, purchase);
    }
    catch (error) {
        return commonUtils_1.default.sendError(req, res, { message: error.message }, 409);
    }
});
const userSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serach } = req.query;
        const usersubscription = yield UserSubscription.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_data',
                },
            },
            {
                $unwind: {
                    path: "$user_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'subscription_id',
                    foreignField: '_id',
                    as: 'subscription_data',
                },
            },
            {
                $unwind: {
                    path: "$subscription_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $match: {
                    $or: [
                        { 'user_data.firstname': { $regex: serach, $options: 'i' } },
                        { 'user_data.lastname': { $regex: serach, $options: 'i' } },
                        { order_id: { $regex: serach, $options: 'i' } },
                    ],
                },
            },
            {
                $project: {
                    _id: 1,
                    order_id: 1,
                    coupon_id: 1,
                    start_date: 1,
                    end_date: 1,
                    payment_status: 1,
                    createdAt: 1,
                    user_first: "$user_data.firstname",
                    user_last: "$user_data.lastname",
                    subscription_price: "$subscription_data.price",
                    total_price: {
                        $cond: {
                            if: { $eq: ["$coupon_id", null] },
                            then: "$subscription_data.price",
                            else: {
                                $subtract: [
                                    "$subscription_data.price",
                                    { $multiply: ["$subscription_data.price", { $divide: [10, 100] }] }
                                ]
                            }
                        }
                    },
                    subscription_currency: "$subscription_data.currency"
                },
            },
        ]);
        return commonUtils_1.default.sendSuccess(req, res, usersubscription);
    }
    catch (error) {
        return commonUtils_1.default.sendError(req, res, { message: error.message }, 409);
    }
});
const userSubscriptionList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersubscription = yield User.aggregate([
            {
                $match: {
                    is_subscription: 1
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    _id: 1,
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    image: 1,
                    createdAt: 1
                },
            },
        ]);
        return commonUtils_1.default.sendSuccess(req, res, usersubscription);
    }
    catch (error) {
        return commonUtils_1.default.sendError(req, res, { message: error.message }, 409);
    }
});
function getNotification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notifications = yield Notification.find({ is_admin: true }).sort({ createdAt: -1 });
            return commonUtils_1.default.sendSuccess(req, res, notifications, 200);
        }
        catch (err) {
            console.log(err);
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function sendAlluserNotification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const message = {
                notification: {
                    title: req.body.title,
                    body: req.body.message
                },
                data: {
                    type: String(5)
                },
                topic: "general_notification",
            };
            yield commoncontroller_1.default.sendAllUserNotification(message);
            return commonUtils_1.default.sendSuccess(req, res, {}, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
const promoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promocode = yield PromoCode.find().select("_id promo_code status createdAt").sort({ createdAt: "desc" });
        return commonUtils_1.default.sendSuccess(req, res, promocode[0]);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const changePromoCodeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const promocode = yield PromoCode.findOne({ _id: id });
        if (!promocode) {
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.PROMOCODE_NOT_FOUND }, 404);
        }
        let newStatus;
        switch (promocode === null || promocode === void 0 ? void 0 : promocode.status) {
            case true:
                newStatus = false;
                break;
            case false:
                newStatus = true;
                break;
            default:
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_STATUS }, 400);
        }
        // Update the user's isApprove status
        promocode.status = newStatus;
        yield promocode.save();
        return commonUtils_1.default.sendSuccess(req, res, promocode);
    }
    catch (error) {
        console.error("Error updating user approval status:", error);
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.SOMETHING_WENT_WRONG }, 500);
    }
});
const createtechniques = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        let techniques = yield new Techniques({
            title
        });
        yield techniques.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: "Techniques created successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const gettechniques = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promocode = yield Techniques.find().select("_id title status createdAt").sort({ createdAt: "desc" });
        return commonUtils_1.default.sendSuccess(req, res, promocode);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const Updattechniques = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.query;
    const techniques = yield Techniques.findById(id);
    if (!techniques)
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.TECHNIQUES_NOT_FOUND }, 409);
    try {
        const { title } = req.body;
        const Title = title || techniques.title;
        techniques.title = Title;
        yield techniques.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: "Techniques updated successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const changestatustechniques = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const { status } = req.body;
    try {
        const techniques = yield Techniques.findOne({ _id: id });
        if (!techniques) {
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.TECHNIQUES_NOT_FOUND }, 404);
        }
        let newStatus;
        switch (status) {
            case 0:
                newStatus = 1;
                break;
            case 1:
                newStatus = 0;
                break;
            default:
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_STATUS }, 400);
        }
        // Update the user's isApprove status
        techniques.status = newStatus;
        yield techniques.save();
        return commonUtils_1.default.sendSuccess(req, res, techniques);
    }
    catch (error) {
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.SOMETHING_WENT_WRONG }, 500);
    }
});
const changeReportPostStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_id, type } = req.body;
        //1=accept 2=reject
        const reportpost = yield reportPost.find({ post_id: new mongoose_1.default.Types.ObjectId(post_id) });
        if (type == 1) {
            reportpost.map((post) => __awaiter(void 0, void 0, void 0, function* () {
                post.status = 1;
                yield post.save();
            }));
            const post = yield Post.findOne({ _id: post_id });
            post.is_reported = 1;
            yield post.save();
        }
        else {
            reportpost.map((post) => __awaiter(void 0, void 0, void 0, function* () {
                post.status = 2;
                yield post.save();
            }));
        }
        return commonUtils_1.default.sendSuccess(req, res, {}, 200);
    }
    catch (error) {
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.SOMETHING_WENT_WRONG }, 500);
    }
});
const changeReportUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, type } = req.body;
        //1=accept 2=reject
        const reportuser = yield reportUser.find({ reported_user_id: new mongoose_1.default.Types.ObjectId(user_id) });
        if (type == 1) {
            reportuser.map((post) => __awaiter(void 0, void 0, void 0, function* () {
                post.status = 1;
                yield post.save();
            }));
            const user = yield User.findOne({ _id: user_id });
            user.is_reported = 1;
            yield user.save();
        }
        else {
            reportuser.map((post) => __awaiter(void 0, void 0, void 0, function* () {
                post.status = 2;
                yield post.save();
            }));
        }
        return commonUtils_1.default.sendSuccess(req, res, {}, 200);
    }
    catch (error) {
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.SOMETHING_WENT_WRONG }, 500);
    }
});
const getpostreport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportpost = yield reportPost.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_name"
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "post_id",
                    foreignField: "_id",
                    as: "post_data"
                }
            },
            {
                $lookup: {
                    from: "reportsubjects",
                    localField: "report_subject_id",
                    foreignField: "_id",
                    as: "report_subject_data"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "post_user_id",
                    foreignField: "_id",
                    as: "report_post_user"
                }
            },
            { $unwind: { path: "$user_name", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$post_data", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$report_subject_data", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$report_post_user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    post_id: 1,
                    status: 1,
                    "user_name": { $concat: ["$user_name.firstname", " ", "$user_name.lastname"] },
                    "report_post_user": { $concat: ["$report_post_user.firstname", " ", "$report_post_user.lastname"] },
                    "post_image": "$post_data.image",
                    "report_name": "$report_subject_data.name",
                }
            },
            {
                $group: {
                    _id: "$post_id",
                    reports: {
                        $push: {
                            user_name: "$user_name",
                        },
                    },
                    firstReport: { $first: "$$ROOT" },
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$firstReport", { reports: "$reports" }],
                    },
                },
            },
        ]);
        return commonUtils_1.default.sendSuccess(req, res, reportpost);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const getuserreport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportpost = yield reportUser.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_name",
                },
            },
            {
                $lookup: {
                    from: "reportsubjects",
                    localField: "report_subject_id",
                    foreignField: "_id",
                    as: "report_subject_data",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reported_user_id",
                    foreignField: "_id",
                    as: "reported_user",
                },
            },
            { $unwind: { path: "$user_name", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$report_subject_data", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$reported_user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    status: 1,
                    reported_user_id: 1,
                    user_id: 1,
                    user_name: { $concat: ["$user_name.firstname", " ", "$user_name.lastname"] },
                    "reported_user": { $concat: ["$reported_user.firstname", " ", "$reported_user.lastname"] },
                    "report_subject": "$report_subject_data.name",
                },
            },
            {
                $group: {
                    _id: "$reported_user_id",
                    reports: {
                        $push: {
                            user_id: "$user_id",
                            user_name: "$user_name",
                        },
                    },
                    firstReport: { $first: "$$ROOT" },
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$firstReport", { reports: "$reports" }],
                    },
                },
            },
        ]);
        return commonUtils_1.default.sendSuccess(req, res, reportpost);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
exports.default = {
    register,
    login,
    // logout,
    // refreshToken,
    getProfile,
    updateProfile,
    changePassword,
    dashboard,
    userList,
    allUserList,
    brokerList,
    changeUserStatus,
    carrierSubUserList,
    WorkList,
    CreateWork,
    Updatework,
    Deletework,
    bilList,
    createBil,
    updateBil,
    changestatusHuntertip,
    UpdathunterTip,
    getSharedPostList,
    getSavedPostList,
    getTutorial,
    CreateTutorial,
    updateTutorial,
    changetutorialStatus,
    uploadImage,
    purchaseplan,
    userSubscription,
    userSubscriptionList,
    getNotification,
    sendAlluserNotification,
    promoCode,
    changePromoCodeStatus,
    createtechniques,
    gettechniques,
    Updattechniques,
    changestatustechniques,
    getpostreport,
    getuserreport,
    changeReportPostStatus,
    changeReportUserStatus,
    pdfDownload
};
//# sourceMappingURL=adminController.js.map