"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const userSubscriptionSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    subscription_id: {
        type: mongoose_1.default.Types.ObjectId,
        require: false
    },
    stripe_subscription_id: {
        type: String,
        require: false
    },
    payment_intent_id: {
        type: String,
        require: false
    },
    transaction_status: {
        type: String,
        require: false,
        default: null
    },
    order_id: {
        type: String,
        require: false
    },
    coupon_id: {
        type: String,
        require: false,
        default: null
    },
    discount: {
        type: Number,
        require: false,
    },
    transaction_json: {
        type: String,
        require: false
    },
    start_date: {
        type: Date,
        default: null
    },
    end_date: {
        type: Date,
        default: null
    },
    payment_status: {
        type: Number,
        required: false,
        default: 0,
        comment: '0 = pending, 1 = running, 2 = update, 3 = fail, 4 = cancel, 5 = expired'
    },
    transaction_id: {
        type: String,
        require: false
    },
    original_transaction_id: {
        type: String,
        require: false
    },
    apple_product_id: {
        type: String,
        require: false
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_USER_SUBSCRIPTION, userSubscriptionSchema);
