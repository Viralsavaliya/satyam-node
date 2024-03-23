import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const TutorialSchema = new mongoose.Schema({
   item: {
      type: String,
      require: true,
   },
   amount:{
    type: String,
    require: true,
   },
   status: {
      type: Number,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
  }
}, { timestamps: true });


module.exports = mongoose.model(AppConstants.MODEL_USER_AMOUNT, TutorialSchema);