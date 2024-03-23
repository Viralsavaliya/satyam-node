import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const reportPostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    type: {
        type: Number,
        required: false,
        comment: '1 = post report, 2 = user report'
    }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_REPORT_SUBJECT, reportPostSchema);