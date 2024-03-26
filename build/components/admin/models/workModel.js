"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appConstants_1 = require("../../../utils/appConstants");
const workSchema = new mongoose_1.default.Schema({
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
module.exports = mongoose_1.default.model(appConstants_1.AppConstants.MODEL_WORK, workSchema);
