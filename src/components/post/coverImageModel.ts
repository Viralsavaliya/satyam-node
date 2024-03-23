import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const coverImageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    folder_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_COVER_IMAGE, coverImageSchema);