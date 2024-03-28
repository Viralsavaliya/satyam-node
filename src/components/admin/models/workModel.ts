import mongoose from "mongoose";
import { AppConstants } from "../../../utils/appConstants";

const workSchema = new mongoose.Schema({
   humanimage: {
      type: String,
      require: false,
   },
   deerimage: {
      type: String,
      require: true,
   },
   // humandescription: {
   //    type: String,
   //    require: true,
   // },
   description: {
      type: String,
      require: true
   },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_WORK, workSchema);