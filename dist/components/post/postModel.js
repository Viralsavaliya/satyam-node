"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const postSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    image: {
        type: String,
        require: false,
        default: null
    },
    latitude: {
        type: Number,
        required: false,
    },
    longitude: {
        type: Number,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    is_delete: {
        type: Number,
        required: false,
        default: 0,
        comment: '0 = no, 1 = yes'
    },
    is_reported: {
        type: Number,
        default: 0,
        comment: '0 = no, 1 = yes'
    },
    is_cover_image: {
        type: Number,
        required: false,
        comment: '0 = no, 1 = yes'
    },
    is_compare: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_POST, postSchema);
//# sourceMappingURL=postModel.js.map