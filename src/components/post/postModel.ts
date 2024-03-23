import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    image: {
        type: String,
        require: false,
        default: null
    },
    latitude: {
        type: Number,
        required: false,
    },
    longitude: {
        type: Number,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    is_delete: {
        type: Number,
        required: false,
        default: 0,
        comment: '0 = no, 1 = yes'
    },
    is_reported: {
        type: Number,
        default: 0,
        comment: '0 = no, 1 = yes'
    },
    is_cover_image: {
        type: Number,
        required: false,
        comment: '0 = no, 1 = yes'
    },
    is_compare: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_POST, postSchema);