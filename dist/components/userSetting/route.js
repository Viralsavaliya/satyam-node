"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settingController_1 = __importDefault(require("./settingController"));
const validation_1 = __importDefault(require("./validation"));
exports.default = [
    {
        path: "/",
        method: "post",
        controller: settingController_1.default.setting,
        validation: validation_1.default.settingValidation,
    },
    {
        path: "/deleteAccount",
        method: "get",
        controller: settingController_1.default.deleteAccount,
        // validation: V.settingValidation,
    },
];
//# sourceMappingURL=route.js.map