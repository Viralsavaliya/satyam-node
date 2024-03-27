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
const ReportSubject = require("./reportPostSubjectModel");
const ReportPost = require("./reportPostModel");
const Post = require("../post/postModel");
const ReportUser = require("./reportUserModel");
function getPostReport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let subjects = yield ReportSubject.find({ type: req.query.type }).select('type name');
            return commonUtils_1.default.sendSuccess(req, res, subjects, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function postReport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userid = req.headers.userid;
            const { post_id, subject_id } = req.body;
            const alreadyreported = yield ReportPost.findOne({ user_id: userid, post_id: post_id });
            if (alreadyreported)
                return commonUtils_1.default.sendError(req, res, { message: "Already Reported" }, 409);
            const post = yield Post.findOne({ _id: post_id });
            if (!post)
                return commonUtils_1.default.sendError(req, res, { message: "post not found" }, 409);
            const reportpost = new ReportPost();
            reportpost.user_id = req.headers.userid;
            reportpost.post_id = post_id;
            reportpost.post_user_id = post.user_id;
            reportpost.report_subject_id = subject_id;
            yield reportpost.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Reported" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function userReport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userid = req.headers.userid;
            const { reported_user_id, subject_id } = req.body;
            const alreadyreported = yield ReportUser.findOne({ user_id: userid, post_id: reported_user_id });
            if (alreadyreported)
                return commonUtils_1.default.sendError(req, res, { message: "Already Reported" }, 409);
            const reportpost = new ReportUser();
            reportpost.user_id = req.headers.userid;
            reportpost.reported_user_id = reported_user_id;
            reportpost.report_subject_id = subject_id;
            yield reportpost.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Reported" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
exports.default = {
    getPostReport,
    postReport,
    userReport,
};
//# sourceMappingURL=reportController.js.map