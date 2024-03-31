"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const userPromoCode = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    promo_code: {
        type: String,
        require: false,
        default: null
    },
    status: {
        type: Number,
        required: false,
        default: 0,
        comment: '0 = pending, 1 = approve'
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_PROMO_CODE_USER, userPromoCode);
//# sourceMappingURL=userPromoCodeModel.js.map