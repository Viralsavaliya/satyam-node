import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const settingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        reference: "users",
        default: null
    },
    save_location_information: {
        type: Boolean,
        required: false,
        default: 0,
        comment: '0 = off, 1 = on',
    },
    share_to_media: {
        type: Boolean,
        required: false,
        default: 0,
        comment: '0 = off, 1 = on',
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_SETTINGPAGES, settingSchema);