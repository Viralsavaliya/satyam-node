"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contactUsController_1 = __importDefault(require("./contactUsController"));
const validation_1 = __importDefault(require("./validation"));
exports.default = [
    {
        path: "/addContactUs",
        method: "post",
        controller: contactUsController_1.default.addContactUs,
        validation: validation_1.default.addPostValidation,
    },
    {
        path: "/getContactUs",
        method: "get",
        controller: contactUsController_1.default.getContactUs,
    },
    {
        path: "/deletecontactus",
        method: "delete",
        controller: contactUsController_1.default.deleteContactUs,
    },
    {
        path: "/updateContactUs",
        method: "patch",
        controller: contactUsController_1.default.updateContactUs,
        validation: validation_1.default.updateValidation,
    },
];
//# sourceMappingURL=route.js.map