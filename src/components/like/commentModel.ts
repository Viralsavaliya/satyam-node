import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const commentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    post_id: {
        type: mongoose.Types.ObjectId,
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

module.exports = mongoose.model(AppConstants.MODEL_COMMENT, commentSchema);