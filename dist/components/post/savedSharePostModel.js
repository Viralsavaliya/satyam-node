"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../utils/appConstants");
const SavedSharePostSchema = new mongoose_1.default.Schema({
    folder_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: false
    },
    post_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    type: {
        type: Number,
        required: false,
        comment: '1 = saved, 2 = shared'
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_SAVED_SHARED_POST, SavedSharePostSchema);
//# sourceMappingURL=savedSharePostModel.js.map