import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";
const mongoose_ = require('mongoose');

const supportChatSchema = new mongoose_.Schema({
    support_ticket_id: {
        type: mongoose.Types.ObjectId,
        reference: "supports",
        default: null
    },
    sender_id: {
        type: Number,
        require: true,
        comment: '1=admin, 2=user'
    },
    receiver_id: {
        type: mongoose.Types.ObjectId,
        require: true,
        comment: '1=admin, 2=user'
    },
    message: {
        type: String,
        required: true,
        default: null
    },
    type: {
        type: Number,
        required: true,
        default: null,
        comment: '1=text, 2=media'
    },
}, { timestamps: true });

module.exports = mongoose_.model(AppConstants.MODEL_CHAT_SUPPORT, supportChatSchema);