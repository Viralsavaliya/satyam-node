"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        require: false,
        default: null
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        require: false,
        min: 10,
        max: 10,
        default: null
    },
    mobile2: {
        type: String,
        require: false,
        min: 10,
        max: 10,
        default: null
    },
    carnumber: {
        type: String,
        require: true,
    },
    billnumber: {
        type: Number,
    },
    address: {
        type: String,
    },
    model: {
        type: String
    },
    chassisno: {
        type: String
    },
    engineno: {
        type: String
    },
}, { timestamps: true });
userSchema.index({
    "location": "2dsphere"
});
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_USER, userSchema);
