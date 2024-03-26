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
const appStrings_1 = require("../../utils/appStrings");
const commonUtils_1 = __importDefault(require("../../utils/commonUtils"));
const config = require("config");
const jwt = require('jsonwebtoken');
// import redisClient from "../../utils/redisHelper"; 
const aes_1 = __importDefault(require("../../utils/aes"));
function verifyToken(req, res, next) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let tokens_ = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')) !== null && _c !== void 0 ? _c : [];
        return new Promise((resolve, reject) => {
            if (tokens_.length <= 1) {
                reject(appStrings_1.AppStrings.INVALID_TOKEN);
            }
            const token = tokens_[1];
            jwt.verify(token, config.get("JWT_ACCESS_SECRET"), (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    if (err.name == "TokenExpiredError") {
                        reject(appStrings_1.AppStrings.TOKEN_EXPIRED);
                    }
                    else {
                        reject(appStrings_1.AppStrings.INVALID_SESSION);
                    }
                }
                else {
                    let midLayer = aes_1.default.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"));
                    const userData = JSON.parse(aes_1.default.decrypt(midLayer.toString(), config.get("OUTER_KEY_USER")));
                    const userObj = { userid: userData.userId, usertype: userData.userType };
                    // let blackListed: [] = await redisClient.lrange('BL_' + midLayer.toString(), 0, -1)
                    // let blackListed_ = blackListed.find(value => value == token)    
                    // let tokens: [] = await redisClient.lrange(midLayer.toString(), 0, -1)
                    // let token_ = tokens.find(value => JSON.parse(value).accessToken.toString() == token.toString())
                    // if (blackListed_ && !token_) {
                    reject(appStrings_1.AppStrings.BLACKLISTED_TOKEN);
                    // } else {
                    // resolve(userObj);
                    // }
                }
            }));
        }).then((userObj) => {
            req.headers.userid = userObj.userid;
            req.headers.usertype = userObj.usertype;
            next();
        }).catch((err) => {
            return commonUtils_1.default.sendError(req, res, { message: err }, 401);
        });
    });
}
function verifyRefreshToken(req, res, next) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let tokens_ = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')) !== null && _c !== void 0 ? _c : [];
        if (tokens_.length > 1) {
            const token = tokens_[1];
            if (token === null)
                return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_REQUEST }, 401);
            jwt.verify(token, config.get("JWT_REFRESH_SECRET"), (err, user) => __awaiter(this, void 0, void 0, function* () {
                console.log("jwt verify:", err);
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_SESSION }, 401);
                    }
                    else {
                        return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.INVALID_SESSION }, 401);
                    }
                }
                else {
                    let midLayer = yield aes_1.default.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"));
                    req.userData = JSON.parse(yield aes_1.default.decrypt(midLayer, config.get("OUTER_KEY_USER")));
                    req.midLayer = midLayer;
                    req.token = token;
                    // let tokens: [] = await redisClient.lrange(midLayer, 0, -1)
                    // let token_ = tokens.find(value => JSON.parse(value).refreshToken.toString() == token.toString())
                    // if (token_) {
                    // return next();
                    // } else {
                    // return commonUtils.sendError(req, res, {message: AppStrings.UNAUTHORIZED}, 401);
                    // }
                }
            }));
        }
        else {
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.UNAUTHORIZED }, 401);
        }
    });
}
exports.default = {
    verifyToken,
    verifyRefreshToken,
};
