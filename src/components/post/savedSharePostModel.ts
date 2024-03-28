import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const SavedSharePostSchema = new mongoose.Schema({
    folder_id: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    post_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    type: {
        type: Number,
        required: false,
        comment: '1 = saved, 2 = shared'
    }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_SAVED_SHARED_POST, SavedSharePostSchema);