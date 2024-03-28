import commonUtils from "../../utils/commonUtils";
import { Request, Response } from "express";

const AboutUs = require("./aboutUsModel");
const mongoose = require("mongoose");

async function addAboutUs(req: Request, res: Response) {
    try {
        const { question, answer } = req.body;
        const about = new AboutUs();
        about.question = question;
        about.answer = answer;
        await about.save();

        return commonUtils.sendSuccess(req, res, { message: "aboutus add successfully!" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function getAboutUs(req: Request, res: Response) {
    try {

        const about = await AboutUs.find().sort({ createdAt: -1 });
        return commonUtils.sendSuccess(req, res, about, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function updateAboutUs(req: Request, res: Response) {
    try {
        const { question, answer } = req.body;
        const about = await AboutUs.findOne({ _id: req.params.id });
        about.question = question;
        about.answer = answer;
        await about.save();
        return commonUtils.sendSuccess(req, res, { message: "aboutus update successfully!" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function changeStatus(req: Request, res: Response) {
    try {
        const about = await AboutUs.findOne({ _id: req.params.id });
        about.status = about.status == 0 ? 1 : 0
        await about.save();
        return commonUtils.sendSuccess(req, res, { message: "status change successfully!" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

export default {
    addAboutUs,
    getAboutUs,
    updateAboutUs,
    changeStatus
}