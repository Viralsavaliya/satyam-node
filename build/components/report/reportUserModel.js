"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const reportUserSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    reported_user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    report_subject_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    status: {
        type: Number,
        default: 0,
        comment: '0 = pending, 1 = accept 2=reject'
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_REPORT_USER, reportUserSchema);
