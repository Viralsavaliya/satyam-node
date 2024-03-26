"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const settingSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        reference: "users",
        default: null
    },
    save_location_information: {
        type: Boolean,
        required: false,
        default: 0,
        comment: '0 = off, 1 = on',
    },
    share_to_media: {
        type: Boolean,
        required: false,
        default: 0,
        comment: '0 = off, 1 = on',
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_SETTINGPAGES, settingSchema);
