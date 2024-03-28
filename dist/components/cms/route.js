"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cmsController_1 = __importDefault(require("./cmsController"));
exports.default = [
    {
        path: "/addCMS",
        method: "post",
        controller: cmsController_1.default.addCMS,
        // validation: V.addPostValidation,
    },
    {
        path: "/getCMS",
        method: "get",
        controller: cmsController_1.default.getCMS,
    },
];
//# sourceMappingURL=route.js.map