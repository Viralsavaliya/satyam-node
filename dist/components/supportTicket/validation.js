"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = __importDefault(require("../../utils/validate"));
const appConstants_1 = require("../../utils/appConstants");
function addAboutValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let validationRule;
        validationRule = {
            "question": `required|string|min:3|max:255|exist:${appConstants_1.AppConstants.MODEL_ABOUT_US},question`,
            "answer": "required",
        };
        validate_1.default.validatorUtilWithCallback(validationRule, {}, req, res, next);
    });
}
function updateAboutValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let ValidationRule = {
            "question": "required|string|max:500|exist_value_admin:AboutUs,question," + req.params.id,
            "answer": "required|string|max:5000"
        };
        validate_1.default.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
    });
}
exports.default = {
    addAboutValidation,
    updateAboutValidation
};
//# sourceMappingURL=validation.js.map