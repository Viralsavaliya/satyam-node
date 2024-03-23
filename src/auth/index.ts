import { Request, Response } from "express";
import commonUtils from "../utils/commonUtils";
import aes from "../utils/aes";
// import redisClient from "../utils/redisHelper";
import mongoose from "mongoose";
import { UserType } from "../utils/enum";
import { AppStrings } from "../utils/appStrings";
const jwt = require('jsonwebtoken');
const config = require("config");
type ObjectId = mongoose.Schema.Types.ObjectId;

import * as Jwt from 'jsonwebtoken';
import { AdminTokenPayload, UserTokenPayload, UserTokenRole } from "./models";

const register = async (user_data: any, userType: any, otp: any) => {

    let uniqueUserKey = aes.encrypt(
        JSON.stringify({
            "userData": user_data,
            "userType": userType,
            "otp": otp
        }), config.get("OUTER_KEY_USER"))

    let payload = await aes.encrypt(uniqueUserKey, config.get("OUTER_KEY_PAYLOAD"))

    const accessToken = jwt.sign({ sub: payload }, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_ACCESS_TIME") });
    const refreshToken = await generateRefreshToken(payload);
    let data = { accessToken: accessToken, refreshToken: refreshToken }
    // await redisClient.lpush(uniqueUserKey.toString(), JSON.stringify(data));

    return data;
}

const login = async (userId: ObjectId, createdAt: Date) => {
    let uniqueUserKey = aes.encrypt(
        JSON.stringify({
            "userId": userId,
            "createdAt": createdAt
        }), config.get("OUTER_KEY_USER"))

    // const oldValue = await redisClient.get('user_' + userId)

    // if (oldValue) {
    //     await logoutforalreadylogin(JSON.parse(oldValue).accessToken);
    // }

    let payload = await aes.encrypt(uniqueUserKey, config.get("OUTER_KEY_PAYLOAD"))

    const accessToken = jwt.sign({ sub: payload }, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_ACCESS_TIME") });

    const refreshToken = await generateRefreshToken(payload);

    let data = { accessToken: accessToken, refreshToken: refreshToken }

    // await redisClient.lpush(uniqueUserKey.toString(), JSON.stringify(data));
    // await redisClient.set('user_' + userId, JSON.stringify(data))

    return data;
}
const adminLogin = async (userId: ObjectId, createdAt: Date) => {
    let uniqueUserKey = aes.encrypt(
        JSON.stringify({
            "userId": userId,
            "createdAt": createdAt
        }), config.get("OUTER_KEY_USER"))

    let payload = await aes.encrypt(uniqueUserKey, config.get("OUTER_KEY_PAYLOAD"))

    const accessToken = jwt.sign({ sub: payload }, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_ACCESS_TIME") });

    const refreshToken = await generateRefreshToken(payload);

    let data = { accessToken: accessToken, refreshToken: refreshToken }

    // await redisClient.lpush(uniqueUserKey.toString(), JSON.stringify(data));

    return data;
}

const logout = async (req: any, res: Response) => {
    const tokens_ = req.headers?.authorization?.split(' ') ?? []
    if (tokens_.length <= 1) {
        return commonUtils.sendError(req, res, { message: AppStrings.INVALID_TOKEN }, 401);
    }
    const token = tokens_[1];

    jwt.verify(token, config.get("JWT_ACCESS_SECRET"), async (err: any, user: any) => {
        if (err) {
            return commonUtils.sendError(req, res, { message: AppStrings.INVALID_TOKEN }, 401);
        } else {
            const uniqueUserKey = aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))

            // let tokens: [] = await redisClient.lrange(uniqueUserKey.toString(), 0, -1)

            // let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token.toString())

            // remove the refresh token
            // await redisClient.lrem(uniqueUserKey.toString(), 1, await redisClient.lindex(uniqueUserKey.toString(), index));
            // blacklist current access token
            // await redisClient.lpush('BL_' + uniqueUserKey.toString(), token);

            return commonUtils.sendSuccess(req, res, {}, 204);
        }
    })
}

const logoutforalreadylogin = async (token: any) => {

    jwt.verify(token, config.get("JWT_ACCESS_SECRET"), async (err: any, user: any) => {
        if (err) {
            console.log(err)
        } else {
            const uniqueUserKey = aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))

            // let tokens: [] = await redisClient.lrange(uniqueUserKey.toString(), 0, -1)

            // let index = tokens.findIndex(value => JSON.parse(value).accessToken.toString() == token.toString())

            // remove the refresh token
            // await redisClient.lrem(uniqueUserKey.toString(), 1, await redisClient.lindex(uniqueUserKey.toString(), index));
            // blacklist current access token
            // await redisClient.lpush('BL_' + uniqueUserKey.toString(), token);

        }
    })
}

const getAccessTokenPromise = async (oldToken: any) => {
    return new Promise((resolve, reject) => {
        jwt.verify(oldToken, config.get("JWT_REFRESH_SECRET"), async (err: any, user: any) => {
            if (err) {
                return reject({ status: 401 });
            } else {
                const uniqueUserKey = aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))

                // let tokens: [] = await redisClient.lrange(uniqueUserKey, 0, -1)
                // let token_ = tokens.find(value => JSON.parse(value).refreshToken.toString() == oldToken.toString())

                // if (!token_) return reject({ error: AppStrings.INVALID_TOKEN, status: 401 });

                // let index = tokens.findIndex(value => JSON.parse(value).refreshToken.toString() == oldToken.toString())

                let payload = aes.encrypt(uniqueUserKey.toString(), config.get("OUTER_KEY_PAYLOAD"))

                const accessToken = jwt.sign({ sub: payload }, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_ACCESS_TIME") });
                const refreshToken = await generateRefreshToken(payload);

                let data = { accessToken: accessToken, refreshToken: refreshToken }

                // await redisClient.lset(uniqueUserKey.toString(), index, JSON.stringify(data));

                return resolve({ accessToken, refreshToken })
            }
        })
    })
}

const getAccessToken = async (req: any, res: Response) => {
    const tokens_ = req.headers?.authorization?.split(' ') ?? []
    if (tokens_.length <= 1) {
        return commonUtils.sendError(req, res, { message: AppStrings.INVALID_TOKEN }, 401);
    }
    const oldToken = tokens_[1];
    getAccessTokenPromise(oldToken).then((result: any) => {
        const { refreshToken, accessToken } = result
        res.cookie("accessToken", accessToken, { maxAge: 900000, httpOnly: true });
        res.cookie("refreshToken", refreshToken, { maxAge: 900000, httpOnly: true });
        return commonUtils.sendSuccess(req, res, {});
    }).catch((err: any) => {
        return commonUtils.sendAdminError(req, res, { message: err?.error }, err.status)
    })
}


const getAdminRefreshToken = async (req: any, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);

    getAccessTokenPromise(refreshToken).then((result: any) => {
        const { refreshToken, accessToken } = result
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
        return commonUtils.sendAdminSuccess(req, res, { accessToken })
    }).catch((err: any) => {
        return commonUtils.sendAdminError(req, res, { message: err?.error }, err.status)
    })
}

const generateRefreshToken = async (payload: string) => {
    return jwt.sign({ sub: payload }, config.get("JWT_REFRESH_SECRET"), { expiresIn: config.get("JWT_REFRESH_TIME") });
}

const _generateAccessToken = async (payload: string, role: UserTokenRole | UserTokenRole[]) => {
    return Jwt.sign({ sub: payload, aud: role }, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_ACCESS_TIME") });
}

const _generateRefreshToken = async (payload: string) => {
    return Jwt.sign({ sub: payload, aud: UserTokenRole.refreshToken }, config.get("JWT_ACCESS_SECRET"), { expiresIn: config.get("JWT_REFRESH_TIME") });
}
const encryptPayload = (data: object) => {
    let encryptedData = aes.encrypt(JSON.stringify(data), config.get("OUTER_KEY_USER"))
    let payload = aes.encrypt(encryptedData, config.get("OUTER_KEY_PAYLOAD"))
    return { data: encryptedData, payload: payload }
}

const decryptPayload = (payload: string) => {
    let decryptedPayload = aes.decrypt(payload, config.get("OUTER_KEY_PAYLOAD"))
    let decryptedData = aes.decrypt(decryptedPayload, config.get("OUTER_KEY_USER"))
    return { data: JSON.parse(decryptedData), decryptedPayload }
}


const generateAdminAccessToken = async (payload: AdminTokenPayload) => {
    let encryptPayloadData = encryptPayload(payload)
    const accessToken = await _generateAccessToken(encryptPayloadData.payload, UserTokenRole.adminAccessToken);
    const refreshToken = await _generateAccessToken(encryptPayloadData.payload, UserTokenRole.adminAccessToken);
    const data = { accessToken, refreshToken }
    // await redisClient.lpush(payload.userId, JSON.stringify(data))
    return data;
}


export default {
    register,
    login,
    logout,
    getAccessToken,
    generateRefreshToken,
    getAdminRefreshToken,
    generateAdminAccessToken,
    adminLogin
}