import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const adminSchema = new mongoose.Schema({
   name: {
      type: String,
   },
   email: {
      type: String,
      require: false,
      unique: true,
      lowercase: true,
      trim: true,
   },
   mobile: {
      type: String,
      require: false,
      min: 10,
      max: 10
   },
   profile: {
      type: String,
      require: false,
   },
   password: {
      type: String,
      require: false
   },
   status: {
      type: Number,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
  },
  image: {
      type: String,
      require: false,
      default: null,
  }
}, { timestamps: true });

adminSchema.index({
   "location": "2dsphere"
})

module.exports = mongoose.model(AppConstants.MODEL_ADMIN, adminSchema);