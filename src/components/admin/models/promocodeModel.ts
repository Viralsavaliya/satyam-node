import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const promocodeSchema = new mongoose.Schema({
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

module.exports = mongoose.model(AppConstants.MODEL_PROMO_CODE, promocodeSchema);