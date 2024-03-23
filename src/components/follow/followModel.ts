import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const followSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    follow_user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    is_follow: {
        type: Number,
        required: false,
        default: 1,
        comment: '0 = no, 1 = yes'
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_FOLLOW_FOLLOWERS, followSchema);