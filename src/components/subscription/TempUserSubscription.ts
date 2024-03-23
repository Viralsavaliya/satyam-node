import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const tempUserSubscription = new mongoose.Schema({
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

module.exports = mongoose.model(AppConstants.MODEL_TEMPUSERSUBSCRIPTION, tempUserSubscription);