"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../../utils/appConstants");
const adminSchema = new mongoose_1.default.Schema({
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
});
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_ADMIN, adminSchema);
