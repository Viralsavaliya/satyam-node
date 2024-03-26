"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const cmsSchema = new mongoose_1.default.Schema({
    terms_condition: {
        type: String,
        required: true
    },
    privacy_policy: {
        type: String,
        required: true
    },
    refund_policy: {
        type: String,
        required: false,
        default: null
    },
    eula: {
        type: String,
        required: false,
        default: null
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_CMSPAGES, cmsSchema);
