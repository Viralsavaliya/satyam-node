import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";
const mongoose_ = require('mongoose');

const NotificationSchema = new mongoose_.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: null
    },
    sender_id: {
        type: mongoose.Types.ObjectId,
        required: false,
    },
    data: {
        type: Object,
        default: null,
    },
    receiver_id: {
        type: mongoose.Types.ObjectId,
        required: false,
    },
    type: {
        type: Number,
        default: null,
        comment: 'FOLLOWUNFOLLOW = 1,POSTCREATE = 2,PLANPURCHASE = 3'
    },
    is_admin: {
        type: Boolean,
        default: 0,
        comment: '1=yes,0=no'
    },
    is_read: {
        type: Boolean,
        default: 0,
        comment: '1 = yes, 0 = no'
    },
    is_delete: {
        type: Number,
        required: false,
        default: 0,
        comment: '0 = no, 1 = yes'
    },
}, { timestamps: true });

module.exports = mongoose_.model(AppConstants.MODEL_NOTIFICATION, NotificationSchema);