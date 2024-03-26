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
const Setting = require("./settingModel");
const User = require("../user/userModel");
function setting(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyName = req.body.key;
            const auth_id = req.headers.userid;
            let setting = yield Setting.findOne({ user_id: auth_id });
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
            yield setting.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Status changed successfully!", data: { id: setting._id, user_id: setting.user_id, save_location_information: setting.save_location_information, share_to_media: setting.share_to_media } }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function deleteAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let findUser = yield User.findOne({ _id: req.headers.userid });
            if (!findUser)
                return commonUtils_1.default.sendError(req, res, { message: "User not found!" }, 409);
            findUser.is_delete_account = 1;
            yield findUser.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "Account delete successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
exports.default = {
    setting,
    deleteAccount
};
