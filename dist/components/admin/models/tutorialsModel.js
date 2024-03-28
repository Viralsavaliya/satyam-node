"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../../utils/appConstants");
const TutorialSchema = new mongoose_1.default.Schema({
    item: {
        type: String,
        require: true,
    },
    amount: {
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
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_USER_AMOUNT, TutorialSchema);
//# sourceMappingURL=tutorialsModel.js.map