import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const techniquesSchema = new mongoose.Schema({
   title: {
      type: String,
      require: false,
   },
   status: {
      type: Number,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
  }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_TECHNIQUES, techniquesSchema);