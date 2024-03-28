import mongoose from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    mailAddress: {
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_CONTACT_US, contactUsSchema);