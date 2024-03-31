"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
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
        type: mongoose_1.default.Types.ObjectId,
        required: false,
    },
    data: {
        type: Object,
        default: null,
    },
    receiver_id: {
        type: mongoose_1.default.Types.ObjectId,
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
module.exports = mongoose_.model(appConstants_1.AppConstants.MODEL_NOTIFICATION, NotificationSchema);
//# sourceMappingURL=notificationModel.js.map