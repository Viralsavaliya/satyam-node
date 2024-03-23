import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const cmsSchema = new mongoose.Schema({
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

module.exports = mongoose.model(AppConstants.MODEL_CMSPAGES, cmsSchema);