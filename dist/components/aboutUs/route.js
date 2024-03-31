"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aboutUsController_1 = __importDefault(require("./aboutUsController"));
const validation_1 = __importDefault(require("./validation"));
exports.default = [
    {
        path: "/addAboutUs",
        method: "post",
        controller: aboutUsController_1.default.addAboutUs,
        validation: validation_1.default.addAboutValidation,
    },
    {
        path: "/getAboutUs",
        method: "get",
        controller: aboutUsController_1.default.getAboutUs,
    },
    {
        path: "/updateAboutUs/:id",
        method: "put",
        controller: aboutUsController_1.default.updateAboutUs,
        validation: validation_1.default.updateAboutValidation,
    },
    {
        path: "/aboutuschangeStatus/:id",
        method: "put",
        controller: aboutUsController_1.default.changeStatus,
    },
];
//# sourceMappingURL=route.js.map