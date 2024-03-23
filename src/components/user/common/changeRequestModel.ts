import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const ChangeRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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
        default:null
    },
    otp: {
        type: String,
        default:null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: AppConstants.TOKEN_EXPIRY_TIME
    }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_CHANGE_REQUEST, ChangeRequestSchema);