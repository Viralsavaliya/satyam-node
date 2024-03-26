"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../../utils/appConstants");
const promocodeSchema = new mongoose_1.default.Schema({
    promo_code: {
        type: String,
        require: false,
    },
    status: {
        type: Boolean,
        required: false,
        default: true,
        comment: 'false is Deactive true is Active'
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_PROMO_CODE, promocodeSchema);
