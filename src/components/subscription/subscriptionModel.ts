import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const subscriptionSchema = new mongoose.Schema({
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

module.exports = mongoose.model(AppConstants.MODEL_SUBSCRIPTION, subscriptionSchema);