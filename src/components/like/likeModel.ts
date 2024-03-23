import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const likeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    post_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    is_like: {
        type: Number,
        required: false,
        default: 1,
        comment: '0 = unlike, 1 = like'
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_LIKE, likeSchema);