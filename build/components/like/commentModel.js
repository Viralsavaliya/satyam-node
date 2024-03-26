"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const commentSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    post_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: false,
    },
    status: {
        type: Number,
        required: false,
        default: 0,
        comment: '0 = Active, 1 = Deactive'
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_COMMENT, commentSchema);
