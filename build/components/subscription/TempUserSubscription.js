"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const tempUserSubscription = new mongoose_1.default.Schema({
    transaction_id: {
        type: String,
        require: false,
        default: null
    },
    apple_product_id: {
        type: String,
        require: false,
        default: null
    },
    original_transaction_id: {
        type: String,
        require: false,
        default: null
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_TEMPUSERSUBSCRIPTION, tempUserSubscription);
