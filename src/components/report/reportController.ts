import commonUtils from "../../utils/commonUtils";
import { Request, Response } from "express";

const ReportSubject = require("./reportPostSubjectModel");
const ReportPost = require("./reportPostModel");
const Post = require("../post/postModel");
const ReportUser = require("./reportUserModel");

async function getPostReport(req: Request, res: Response) {
    try {
        let subjects = await ReportSubject.find({ type: req.query.type }).select('type name');
        return commonUtils.sendSuccess(req, res, subjects, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function postReport(req: Request, res: Response) {
    try {
        const userid = req.headers.userid;
        const { post_id, subject_id } = req.body;

        const alreadyreported = await ReportPost.findOne({ user_id: userid, post_id: post_id })
        if (alreadyreported) return commonUtils.sendError(req, res, { message: "Already Reported" }, 409)

        const post = await Post.findOne({ _id: post_id })
        if (!post) return commonUtils.sendError(req, res, { message: "post not found" }, 409)

        const reportpost = new ReportPost();
        reportpost.user_id = req.headers.userid;
        reportpost.post_id = post_id
        reportpost.post_user_id = post.user_id
        reportpost.report_subject_id = subject_id
        await reportpost.save();

        return commonUtils.sendSuccess(req, res, { message: "Reported" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function userReport(req: Request, res: Response) {
    try {
        const userid = req.headers.userid;
        const { reported_user_id, subject_id } = req.body;

        const alreadyreported = await ReportUser.findOne({ user_id: userid, post_id: reported_user_id })
        if (alreadyreported) return commonUtils.sendError(req, res, { message: "Already Reported" }, 409)

        const reportpost = new ReportUser();
        reportpost.user_id = req.headers.userid;
        reportpost.reported_user_id = reported_user_id
        reportpost.report_subject_id = subject_id
        await reportpost.save();

        return commonUtils.sendSuccess(req, res, { message: "Reported" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

export default {
    getPostReport,
    postReport,
    userReport,
}