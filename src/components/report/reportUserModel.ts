import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const reportUserSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    reported_user_id: {
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

module.exports = mongoose.model(AppConstants.MODEL_REPORT_USER, reportUserSchema);