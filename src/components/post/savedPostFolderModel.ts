import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const savedPostFolderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    folder_name: {
        type: String,
        require: false,
        default: null
    },
    is_delete: {
        type: Number,
        required: false,
        default: 0,
        comment: '0 = no, 1 = yes'
    },
    
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_SAVED_POST_FOLDER, savedPostFolderSchema);