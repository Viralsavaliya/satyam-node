import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const userPromoCode = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
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

module.exports = mongoose.model(AppConstants.MODEL_PROMO_CODE_USER, userPromoCode);