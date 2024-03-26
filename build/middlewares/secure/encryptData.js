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
const crypto_1 = __importDefault(require("crypto"));
const config = require("config");
const API_KEY_ENC = config.get("API_KEY_ENC");
const API_ENCRYPT_VI_KEY = config.get("API_ENCRYPT_VI_KEY");
function encryptedDataResponse(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const cipher = crypto_1.default.createCipheriv("aes-256-cbc", API_KEY_ENC, API_ENCRYPT_VI_KEY);
        const message = data ? JSON.stringify(data) : "";
        let encryptedData = cipher.update(message, "utf-8", "base64");
        encryptedData += cipher.final("base64");
        const mac = crypto_1.default.createHmac('sha256', API_KEY_ENC)
            .update(Buffer.from(Buffer.from(API_ENCRYPT_VI_KEY).toString("base64") + encryptedData, "utf-8").toString())
            .digest('hex');
        return {
            'mac': mac,
            'value': encryptedData
        };
    });
}
function EncryptData(req, res, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.env && req.headers.env === "test") {
            return data;
        }
        else {
            return yield encryptedDataResponse(data);
        }
    });
}
function encryptedDataRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        const API_KEY_ENC = req.query.API_KEY_ENC;
        const API_ENCRYPT_VI_KEY = req.query.API_ENCRYPT_VI_KEY;
        if (!API_KEY_ENC || !API_ENCRYPT_VI_KEY) {
            return res.status(400).send({
                message: "API_KEY_ENC and API_ENCRYPT_VI_KEY are required"
            });
        }
        try {
            const cipher = crypto_1.default.createCipheriv("aes-256-cbc", API_KEY_ENC.trim(), API_ENCRYPT_VI_KEY.trim());
            const message = JSON.stringify(data);
            let encryptedData = cipher.update(message, "utf-8", "base64");
            encryptedData += cipher.final("base64");
            const mac = crypto_1.default.createHmac('sha256', API_KEY_ENC)
                .update(Buffer.from(Buffer.from(API_ENCRYPT_VI_KEY).toString("base64") + encryptedData, "utf-8").toString())
                .digest('hex');
            return res.status(200).send({
                'mac': mac,
                'value': encryptedData
            });
        }
        catch (error) {
            return error;
        }
    });
}
exports.default = {
    EncryptedData: EncryptData,
    encryptedDataResponse: encryptedDataResponse,
    encryptedDataRequest: encryptedDataRequest
};
