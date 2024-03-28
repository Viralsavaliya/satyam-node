import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const aboutUsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 1,
        comment: '0 is Deactive 1 is Active'
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_ABOUT_US, aboutUsSchema);