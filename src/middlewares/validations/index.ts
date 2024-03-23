import {NextFunction, Request, Response} from "express"
import {AppStrings} from "../../utils/appStrings";
import commonUtils from "../../utils/commonUtils";

const config = require("config")
const jwt = require('jsonwebtoken')
// import redisClient from "../../utils/redisHelper"; 
import aes from "../../utils/aes";

async function verifyToken(req: any, res: Response, next: Function) {
    let tokens_ = req.headers?.authorization?.split(' ') ?? []

    return new Promise((resolve, reject) => {
        if(tokens_.length <= 1){
            reject(AppStrings.INVALID_TOKEN);
        }
        const token = tokens_[1];
        jwt.verify(token, config.get("JWT_ACCESS_SECRET"), async (err: any, user: any) => {
            if (err) {
                console.log(err)
                if (err.name == "TokenExpiredError") {
                    reject(AppStrings.TOKEN_EXPIRED);
                } else {
                    reject(AppStrings.INVALID_SESSION);
                }
            } else {
                let midLayer = aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))
                const userData = JSON.parse(aes.decrypt(midLayer.toString(), config.get("OUTER_KEY_USER")));
                const userObj = { userid : userData.userId,usertype : userData.userType}           
                // let blackListed: [] = await redisClient.lrange('BL_' + midLayer.toString(), 0, -1)
                // let blackListed_ = blackListed.find(value => value == token)    
    
                // let tokens: [] = await redisClient.lrange(midLayer.toString(), 0, -1)
                // let token_ = tokens.find(value => JSON.parse(value).accessToken.toString() == token.toString())
                
                // if (blackListed_ && !token_) {
                    reject(AppStrings.BLACKLISTED_TOKEN);
                // } else {
                    // resolve(userObj);
                // }
            }
        })
    }).then((userObj: any) => {
        req.headers.userid = userObj.userid;
        req.headers.usertype = userObj.usertype;
        next();
    }).catch((err: any) => {
        return commonUtils.sendError(req, res, {message: err}, 401);
    })
}

async function verifyRefreshToken(req: any, res: Response, next: Function) {
    let tokens_ = req.headers?.authorization?.split(' ') ?? []
    if (tokens_.length > 1) {
        const token = tokens_[1];

        if (token === null) return commonUtils.sendError(req, res, {message: AppStrings.INVALID_REQUEST}, 401);

        jwt.verify(token, config.get("JWT_REFRESH_SECRET"), async (err: any, user: any) => {
            console.log("jwt verify:",err)
            if (err) {
                if (err.name == "TokenExpiredError") {
                    return commonUtils.sendError(req, res, {message: AppStrings.INVALID_SESSION}, 401)
                } else {
                    return commonUtils.sendError(req, res, {message: AppStrings.INVALID_SESSION}, 401)
                }
            } else {
                let midLayer = await aes.decrypt(user.sub, config.get("OUTER_KEY_PAYLOAD"))

                req.userData = JSON.parse(await aes.decrypt(midLayer, config.get("OUTER_KEY_USER")));
                req.midLayer = midLayer
                req.token = token

                // let tokens: [] = await redisClient.lrange(midLayer, 0, -1)
                // let token_ = tokens.find(value => JSON.parse(value).refreshToken.toString() == token.toString())

                // if (token_) {
                    // return next();
                // } else {
                    // return commonUtils.sendError(req, res, {message: AppStrings.UNAUTHORIZED}, 401);
                // }
            }
        })
    } else {
        return commonUtils.sendError(req, res, {message: AppStrings.UNAUTHORIZED}, 401);
    }
}


export default {
    verifyToken,
    verifyRefreshToken,
}