"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const commonUtils_1 = __importDefault(require("../utils/commonUtils"));
const aes_1 = __importDefault(require("../utils/aes"));
const appStrings_1 = require("../utils/appStrings");
const jwt = require('jsonwebtoken');
const config = require("config");
const Jwt = __importStar(require("jsonwebtoken"));
const models_1 = require("./models");
const register = (user_data, userType, otp) => __awaiter(void 0, void 0, void 0, function* () {
    let uniqueUserKey = aes_1.default.encrypt(JSON.stringify({
        "userData": user_data,
        "userType": userType,
        "otp": otp
    }), process.env.OUTER_KEY_USER);
    let payload = yield aes_1.default.encrypt(uniqueUserKey, process.env.OUTER_KEY_PAYLOAD);
    const accessToken = jwt.sign({ sub: payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
    const refreshToken = yield generateRefreshToken(payload);
    let data = { accessToken: accessToken, refreshToken: refreshToken };
    return data;
});
const login = (userId, createdAt) => __awaiter(void 0, void 0, void 0, function* () {
    let uniqueUserKey = aes_1.default.encrypt(JSON.stringify({
        "userId": userId,
        "createdAt": createdAt
    }), process.env.OUTER_KEY_USER);
    // const oldValue = await redisClient.get('user_' + userId)
    // if (oldValue) {
    //     await logoutforalreadylogin(JSON.parse(oldValue).accessToken);
    // }
    let payload = yield aes_1.default.encrypt(uniqueUserKey, process.env.OUTER_KEY_PAYLOAD);
    const accessToken = jwt.sign({ sub: payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
    const refreshToken = yield generateRefreshToken(payload);
    let data = { accessToken: accessToken, refreshToken: refreshToken };
    // await redisClient.lpush(uniqueUserKey.toString(), JSON.stringify(data));
    // await redisClient.set('user_' + userId, JSON.stringify(data))
    return data;
});
const adminLogin = (userId, createdAt) => __awaiter(void 0, void 0, void 0, function* () {
    let uniqueUserKey = aes_1.default.encrypt(JSON.stringify({
        "userId": userId,
        "createdAt": createdAt
    }), process.env.OUTER_KEY_USER);
    let payload = yield aes_1.default.encrypt(uniqueUserKey, process.env.OUTER_KEY_PAYLOAD);
    const accessToken = jwt.sign({ sub: payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
    const refreshToken = yield generateRefreshToken(payload);
    let data = { accessToken: accessToken, refreshToken: refreshToken };
    // await redisClient.lpush(uniqueUserKey.toString(), JSON.stringify(data));
    return data;
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const tokens_ = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')) !== null && _c !== void 0 ? _c : [];
    if (tokens_.length <= 1) {
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_TOKEN }, 401);
    }
    const token = tokens_[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_TOKEN }, 401);
        }
        else {
            const uniqueUserKey = aes_1.default.decrypt(user.sub, process.env.OUTER_KEY_PAYLOAD);
            // let tokens: [] = await redisClient.lrange(uniqueUserKey.toString(), 0, -1)
            // let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token.toString())
            // remove the refresh token
            // await redisClient.lrem(uniqueUserKey.toString(), 1, await redisClient.lindex(uniqueUserKey.toString(), index));
            // blacklist current access token
            // await redisClient.lpush('BL_' + uniqueUserKey.toString(), token);
            return commonUtils_1.default.sendSuccess(req, res, {}, 204);
        }
    }));
});
const logoutforalreadylogin = (token) => __awaiter(void 0, void 0, void 0, function* () {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
        }
        else {
            const uniqueUserKey = aes_1.default.decrypt(user.sub, process.env.OUTER_KEY_PAYLOAD);
            // let tokens: [] = await redisClient.lrange(uniqueUserKey.toString(), 0, -1)
            // let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token.toString())
            // remove the refresh token
            // await redisClient.lrem(uniqueUserKey.toString(), 1, await redisClient.lindex(uniqueUserKey.toString(), index));
            // blacklist current access token
            // await redisClient.lpush('BL_' + uniqueUserKey.toString(), token);
        }
    }));
});
const getAccessTokenPromise = (oldToken) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return reject({ status: 401 });
            }
            else {
                const uniqueUserKey = aes_1.default.decrypt(user.sub, process.env.OUTER_KEY_PAYLOAD);
                // let tokens: [] = await redisClient.lrange(uniqueUserKey, 0, -1)
                // let token_ = tokens.find(value => JSON.parse(value).refreshToken.toString() == oldToken.toString())
                // if (!token_) return reject({ error: AppStrings.INVALID_TOKEN, status: 401 });
                // let index = tokens.findIndex(value => JSON.parse(value).refreshToken.toString() == oldToken.toString())
                let payload = aes_1.default.encrypt(uniqueUserKey.toString(), process.env.OUTER_KEY_PAYLOAD);
                const accessToken = jwt.sign({ sub: payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
                const refreshToken = yield generateRefreshToken(payload);
                let data = { accessToken: accessToken, refreshToken: refreshToken };
                // await redisClient.lset(uniqueUserKey.toString(), index, JSON.stringify(data));
                return resolve({ accessToken, refreshToken });
            }
        }));
    });
});
const getAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const tokens_ = (_f = (_e = (_d = req.headers) === null || _d === void 0 ? void 0 : _d.authorization) === null || _e === void 0 ? void 0 : _e.split(' ')) !== null && _f !== void 0 ? _f : [];
    if (tokens_.length <= 1) {
        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_TOKEN }, 401);
    }
    const oldToken = tokens_[1];
    getAccessTokenPromise(oldToken).then((result) => {
        const { refreshToken, accessToken } = result;
        res.cookie("accessToken", accessToken, { maxAge: 900000, httpOnly: true });
        res.cookie("refreshToken", refreshToken, { maxAge: 900000, httpOnly: true });
        return commonUtils_1.default.sendSuccess(req, res, {});
    }).catch((err) => {
        return commonUtils_1.default.sendAdminError(req, res, { message: err === null || err === void 0 ? void 0 : err.error }, err.status);
    });
});
const getAdminRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.sendStatus(401);
    getAccessTokenPromise(refreshToken).then((result) => {
        const { refreshToken, accessToken } = result;
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
        return commonUtils_1.default.sendAdminSuccess(req, res, { accessToken });
    }).catch((err) => {
        return commonUtils_1.default.sendAdminError(req, res, { message: err === null || err === void 0 ? void 0 : err.error }, err.status);
    });
});
const generateRefreshToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jwt.sign({ sub: payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME });
});
const _generateAccessToken = (payload, role) => __awaiter(void 0, void 0, void 0, function* () {
    return Jwt.sign({ sub: payload, aud: role }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
});
const _generateRefreshToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return Jwt.sign({ sub: payload, aud: models_1.UserTokenRole.refreshToken }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME });
});
const encryptPayload = (data) => {
    let encryptedData = aes_1.default.encrypt(JSON.stringify(data), process.env.OUTER_KEY_USER);
    let payload = aes_1.default.encrypt(encryptedData, process.env.OUTER_KEY_PAYLOAD);
    return { data: encryptedData, payload: payload };
};
const decryptPayload = (payload) => {
    let decryptedPayload = aes_1.default.decrypt(payload, process.env.OUTER_KEY_PAYLOAD);
    let decryptedData = aes_1.default.decrypt(decryptedPayload, process.env.OUTER_KEY_USER);
    return { data: JSON.parse(decryptedData), decryptedPayload };
};
const generateAdminAccessToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let encryptPayloadData = encryptPayload(payload);
    const accessToken = yield _generateAccessToken(encryptPayloadData.payload, models_1.UserTokenRole.adminAccessToken);
    const refreshToken = yield _generateAccessToken(encryptPayloadData.payload, models_1.UserTokenRole.adminAccessToken);
    const data = { accessToken, refreshToken };
    // await redisClient.lpush(payload.userId, JSON.stringify(data))
    return data;
});
exports.default = {
    register,
    login,
    logout,
    getAccessToken,
    generateRefreshToken,
    getAdminRefreshToken,
    generateAdminAccessToken,
    adminLogin
};
//# sourceMappingURL=index.js.map