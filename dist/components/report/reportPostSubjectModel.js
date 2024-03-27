"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const reportPostSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: false
    },
    type: {
        type: Number,
        required: false,
        comment: '1 = post report, 2 = user report'
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_REPORT_SUBJECT, reportPostSchema);
//# sourceMappingURL=reportPostSubjectModel.js.map