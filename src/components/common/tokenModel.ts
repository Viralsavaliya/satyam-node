import { AppConstants } from "../../utils/appConstants";
import mongoose, { Schema } from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    otp: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    country_code: {
        type: String,
        default: "",
    },
    token: {
        type: String,
        required: false
    },
    device: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    requestCount: {
        type: Number,
        default: 0
    },
    reason: {
        type: String,
        default: null
    },
    end_time: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: AppConstants.TOKEN_EXPIRY_TIME
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_TOKEN, TokenSchema)