"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const likeSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    post_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    is_like: {
        type: Number,
        required: false,
        default: 1,
        comment: '0 = unlike, 1 = like'
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_LIKE, likeSchema);
//# sourceMappingURL=likeModel.js.map