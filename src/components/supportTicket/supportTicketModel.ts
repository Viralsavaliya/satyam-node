import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const supportSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        reference: "users",
        default: null
    },
    email: {
        type: String,
        required: true,
        default: null
    },
    subject: {
        type: String,
        required: true,
        default: null
    },
    description: {
        type: String,
        required: true,
        default: null
    },
    files: {
        type: Array,
        required: false,
        default: null
    },
    status: {
        type: Number,
        required: false,
        default: 1,
        comment: '1 is Pending 2 is Closed'
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_SUPPORT_TICKET, supportSchema);