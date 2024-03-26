"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const ChangeRequestSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    mobile: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: false,
        unique: false,
        lowercase: true,
        trim: true,
    },
    token: {
        type: String,
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: appConstants_1.AppConstants.TOKEN_EXPIRY_TIME
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_CHANGE_REQUEST, ChangeRequestSchema);
