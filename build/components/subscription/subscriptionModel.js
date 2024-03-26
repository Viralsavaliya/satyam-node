"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const subscriptionSchema = new mongoose_1.default.Schema({
    plan_name: {
        type: String,
        require: false
    },
    product_id: {
        type: String,
        require: false,
        default: null
    },
    price: {
        type: Number,
        require: false
    },
    currency: {
        type: String,
        require: false
    },
    price_id: {
        type: String,
        require: false
    },
    duration: {
        type: String,
        require: false
    },
    sku_code: {
        type: String,
        require: false
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_SUBSCRIPTION, subscriptionSchema);
