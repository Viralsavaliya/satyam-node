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
const commonUtils_1 = __importDefault(require("../../utils/commonUtils"));
const AboutUs = require("./aboutUsModel");
const mongoose = require("mongoose");
function addAboutUs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { question, answer } = req.body;
            const about = new AboutUs();
            about.question = question;
            about.answer = answer;
            yield about.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "aboutus add successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getAboutUs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const about = yield AboutUs.find().sort({ createdAt: -1 });
            return commonUtils_1.default.sendSuccess(req, res, about, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function updateAboutUs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { question, answer } = req.body;
            const about = yield AboutUs.findOne({ _id: req.params.id });
            about.question = question;
            about.answer = answer;
            yield about.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "aboutus update successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function changeStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const about = yield AboutUs.findOne({ _id: req.params.id });
            about.status = about.status == 0 ? 1 : 0;
            yield about.save();
            return commonUtils_1.default.sendSuccess(req, res, { message: "status change successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
exports.default = {
    addAboutUs,
    getAboutUs,
    updateAboutUs,
    changeStatus
};
//# sourceMappingURL=aboutUsController.js.map