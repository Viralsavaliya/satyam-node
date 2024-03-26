"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../../utils/appConstants");
const huntertipSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
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
    billnumber: {
        type: Number,
    },
    millage: {
        type: Number,
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_USER_BIL, huntertipSchema);
