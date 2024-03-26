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
const config = require("config");
const appStrings_1 = require("../../utils/appStrings");
const crypto = require("crypto");
const Admin = require("../../components/admin/models/adminModel");
const API_KEY_DEC = config.get("API_KEY_DEC");
const API_DECRYPT_VI_KEY = config.get("API_DECRYPT_VI_KEY");
function DecryptedDataResponse(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decipher = yield crypto.createDecipheriv("aes-256-cbc", API_KEY_DEC, API_DECRYPT_VI_KEY);
            if (req.body && req.body.value && req.body.value !== "") {
                let encryptedData = req.body.value;
                let decryptedData = decipher.update(encryptedData, "base64", "utf-8");
                decryptedData += decipher.final("utf-8");
                req.body = JSON.parse(decryptedData);
                next();
            }
            else {
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.DECRYPT_DATA_IS_REQUIRED }, 400);
            }
        }
        catch (e) {
            return commonUtils_1.default.sendError(req, res, {
                "message": e
            });
        }
    });
}
function DecryptData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === "GET")
            return next();
        if (req.headers.env && req.headers.env === "test") {
            next();
        }
        else {
            return DecryptedDataResponse(req, res, next);
        }
    });
}
function DecryptedDataRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const API_KEY_DEC = req.query.API_KEY_DEC;
        const API_DECRYPT_VI_KEY = req.query.API_DECRYPT_VI_KEY;
        if (!API_KEY_DEC || !API_DECRYPT_VI_KEY) {
            return res.status(400).send({
                message: "API_KEY_DEC and API_DECRYPT_VI_KEY are required"
            });
        }
        try {
            const decipher = yield crypto.createDecipheriv("aes-256-cbc", API_KEY_DEC.trim(), API_DECRYPT_VI_KEY.trim());
            if (req.body && req.body.value && req.body.value !== "") {
                let encryptedData = req.body.value;
                let decryptedData = decipher.update(encryptedData, "base64", "utf-8");
                decryptedData += decipher.final("utf-8");
                const data = JSON.parse(decryptedData);
                return commonUtils_1.default.sendSuccess(req, res, data);
            }
            else {
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_REQUEST }, 400);
            }
        }
        catch (e) {
            return commonUtils_1.default.sendError(req, res, {
                "message": e
            });
        }
    });
}
function checkAdminAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminExist = yield Admin.findById(req.headers.userid);
        if (!adminExist) {
            return commonUtils_1.default.sendError(req, res, { message: 'blacklisted token!' }, 409);
        }
        else {
            next();
        }
    });
}
exports.default = {
    DecryptedData: DecryptData,
    DecryptedDataRequest: DecryptedDataRequest,
    checkAdminAuth
};
