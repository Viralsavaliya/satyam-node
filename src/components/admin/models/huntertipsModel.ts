import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const huntertipSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Types.ObjectId,
      required: true
  },
   Allitem: {
      type: Object,
      require: false,
   },
   status: {
      type: Number,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
   },
   billnumber:{
      type:Number,
  },
  millage:{
   type:Number,
  }
}, { timestamps: true });


module.exports = mongoose.model(AppConstants.MODEL_USER_BIL, huntertipSchema);