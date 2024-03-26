"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const supportSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        reference: "users",
        default: null
    },
    email: {
        type: String,
        required: true,
        default: null
    },
    subject: {
        type: String,
        required: true,
        default: null
    },
    description: {
        type: String,
        required: true,
        default: null
    },
    files: {
        type: Array,
        required: false,
        default: null
    },
    status: {
        type: Number,
        required: false,
        default: 1,
        comment: '1 is Pending 2 is Closed'
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_SUPPORT_TICKET, supportSchema);
