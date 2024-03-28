import commonUtils from "../../utils/commonUtils";
import { Request, Response } from "express";

const CMS = require("./cmsModel");
import { AppStrings } from "../../utils/appStrings";

async function addCMS(req: Request, res: Response) {
  try {
    const { terms_condition, privacy_policy } = req.body;

    const cms = await CMS.findOne({}) ;
    const cmsData = cms != null ? cms : new CMS();
    cmsData.privacy_policy = privacy_policy;
    cmsData.terms_condition = terms_condition;
    await cmsData.save();

    return commonUtils.sendSuccess(req, res, {}, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

async function getCMS(req: Request, res: Response) {
  try {
    const contact = await CMS.findOne().select("_id privacy_policy terms_condition");
    return commonUtils.sendSuccess(req, res, contact, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

export default {
  addCMS,
  getCMS
}