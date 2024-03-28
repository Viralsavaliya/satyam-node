"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const mongoose_ = require('mongoose');
const supportChatSchema = new mongoose_.Schema({
    support_ticket_id: {
        type: mongoose_1.default.Types.ObjectId,
        reference: "supports",
        default: null
    },
    sender_id: {
        type: Number,
        require: true,
        comment: '1=admin, 2=user'
    },
    receiver_id: {
        type: mongoose_1.default.Types.ObjectId,
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
module.exports = mongoose_.model(appConstants_1.AppConstants.MODEL_CHAT_SUPPORT, supportChatSchema);
//# sourceMappingURL=supportChatModel.js.map