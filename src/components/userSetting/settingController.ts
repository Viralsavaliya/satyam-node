import commonUtils from "../../utils/commonUtils";
import { Request, Response } from "express";

const Setting = require("./settingModel");
const User = require("../user/userModel");

async function setting(req: Request, res: Response) {
  try {
    const keyName = req.body.key;
    const auth_id = req.headers.userid;
    let setting = await Setting.findOne({ user_id: auth_id });
    if (!setting) {
      setting = new Setting({
        user_id: auth_id,
        save_location_information: 0,
        share_to_media: 0,
      });
    }

    if (keyName === "save_location_information") {
      setting.save_location_information = setting.save_location_information === false ? true : false;
    }
    if (keyName === "share_to_media") {
      setting.share_to_media = setting.share_to_media === false ? true : false;
    }

    await setting.save();
    return commonUtils.sendSuccess(req, res, { message: "Status changed successfully!", data: { id: setting._id, user_id: setting.user_id, save_location_information: setting.save_location_information, share_to_media: setting.share_to_media } }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

async function deleteAccount(req: Request, res: Response) {
  try {
    let findUser = await User.findOne({ _id: req.headers.userid })
    if (!findUser) return commonUtils.sendError(req, res, { message: "User not found!" }, 409);

    findUser.is_delete_account = 1;
    await findUser.save();

    return commonUtils.sendSuccess(req, res, { message: "Account delete successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

export default {
  setting,
  deleteAccount
}