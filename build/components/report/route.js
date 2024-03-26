"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reportController_1 = __importDefault(require("./reportController"));
// import V from "./validation";
exports.default = [
    {
        path: "/getPostReport",
        method: "get",
        controller: reportController_1.default.getPostReport,
        // validation: V.savedPostValidation,
    },
    {
        path: "/postReport",
        method: "post",
        controller: reportController_1.default.postReport,
        // validation: V.savedPostValidation,
    },
    {
        path: "/userReport",
        method: "post",
        controller: reportController_1.default.userReport,
        // validation: V.savedPostValidation,
    },
];
