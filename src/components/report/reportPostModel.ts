import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const reportPostSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    post_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    post_user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    report_subject_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: Number,
        default: 0,
        comment: '0 = pending, 1 = accept 2=reject'
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_REPORT_POST, reportPostSchema);