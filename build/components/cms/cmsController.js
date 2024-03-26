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
const CMS = require("./cmsModel");
function addCMS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { terms_condition, privacy_policy } = req.body;
            const cms = yield CMS.findOne({});
            const cmsData = cms != null ? cms : new CMS();
            cmsData.privacy_policy = privacy_policy;
            cmsData.terms_condition = terms_condition;
            yield cmsData.save();
            return commonUtils_1.default.sendSuccess(req, res, {}, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getCMS(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contact = yield CMS.findOne().select("_id privacy_policy terms_condition");
            return commonUtils_1.default.sendSuccess(req, res, contact, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
exports.default = {
    addCMS,
    getCMS
};
