"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const contactUsSchema = new mongoose_1.default.Schema({
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
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_CONTACT_US, contactUsSchema);
//# sourceMappingURL=contactUsModel.js.map