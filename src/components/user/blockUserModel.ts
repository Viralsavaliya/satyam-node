import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const blockUserSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    block_user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    is_block: {
        type: Boolean,
        default: true,
        comment: "true = blocked, false = unblock"
    }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_BLOCK_USER, blockUserSchema);