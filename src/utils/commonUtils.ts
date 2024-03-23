import { AppConstants } from "./appConstants";
import moment from "moment";
import express, { NextFunction, Request, Response } from "express";
import encryptedData from "../middlewares/secure/encryptData";
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
const path = require('path')
const os = require('os')
const md5 = require("md5");
import decryptedData from "../middlewares/secure/decryptData";
import verifyToken from "../middlewares/validations";

const fs = require("fs");

const getRootDir = () => path.parse(process.cwd()).root
const getHomeDir = () => os.homedir()
const getPubDir = () => "./public"


function formatDate(date: any) {
    return moment(date).format(AppConstants.DATE_FORMAT)
}

async function sendSuccess(req: Request, res: Response, data: any, statusCode = 200) {
    if (req.headers.env === "test") {
        return res.status(statusCode).send(data)
    }

    let encData = await encryptedData.EncryptedData(req, res, data)
    return res.status(statusCode).send(encData)
}

async function sendAdminSuccess(req: Request, res: Response, data: any, statusCode = 200) {
    return res.status(statusCode).send(data)
}

async function sendAdminError(req: Request, res: Response, data: any, statusCode = 422) {
    return res.status(statusCode).send(data)
}

async function sendError(req: Request, res: Response, data: any, statusCode = 422) {
    // if (req.headers.env === "test") {
    //     return res.status(statusCode).send(data)
    // }

    // let encData = await encryptedData.EncryptedData(req, res, data)
    return res.status(statusCode).send(data)
}

function getCurrentUTC(format = AppConstants.DATE_FORMAT, addMonth: any = null, addSeconds: number = 0) {
    // console.log(moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    if (addMonth != null) {
        return moment.utc(new Date()).add(addMonth, 'M').format(format);
    } else if (addSeconds > 0) {
        return moment.utc(new Date()).add(addSeconds, 'seconds').format(format);
    } else {
        return moment.utc(new Date()).add().format(format);
    }
}

function formattedErrors(err: any) {
    let transformed: any = {};
    Object.keys(err).forEach(function (key, val) {
        transformed[key] = err[key][0];
    })
    return transformed
}

export const fileStorage = multer.diskStorage({
    destination: (request: Request, file: any, callback: DestinationCallback): void => {
        callback(null, './src/uploads/images')
    },

    filename: (req: Request, file: any, callback: FileNameCallback): void => {
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname))
    }
})
export const categoryFileStorage = multer.diskStorage({
    destination: (request: Request, file: any, callback: DestinationCallback): void => {
        callback(null, './uploads/category')
    },

    filename: (req: Request, file: any, callback: FileNameCallback): void => {
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname))
    }
})



export const fileFilter = (request: Request, file: any, callback: FileFilterCallback): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp'
    ) {
        callback(null, true)
    } else {
        // callback(null, false)
        callback(new Error('Only .png, .jpg and .jpeg .webp format allowed!'));

    }
}
export const fileFilterSupport = (request: Request, file: any, callback: FileFilterCallback): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        callback(null, true)
    } else {
        // callback(null, false)
        callback(new Error('Only .png, .jpg and .jpeg .webp .pdf .doc format allowed!'));

    }
}


const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).single('image')

    upload(req, res, (err: any) => {
        if (err) {
            return sendError(req, res, err)
        }
        next()
    })
}

const routeArray = (array_: any, prefix: any, isAdmin: Boolean = false) => {
    // path: "", method: "post", controller: "",validation: ""(can be array of validation), 
    // isEncrypt: boolean (default true), isPublic: boolean (default false)

    array_.forEach((route: any) => {
        const method = route.method as "get" | "post" | "put" | "delete" | "patch";
        const path = route.path;
        const controller = route.controller;
        const validation = route.validation;
        let middlewares = [];
        const isEncrypt = route.isEncrypt === undefined ? true : route.isEncrypt;
        const isPublic = route.isPublic === undefined ? false : route.isPublic;
        if (isEncrypt && !isAdmin) {
            middlewares.push(decryptedData.DecryptedData);
        }
        if (!isPublic) {
            middlewares.push(verifyToken.verifyToken);
        }
        if (route.isAdmin) { // check for admin login or not
            middlewares.push(decryptedData.checkAdminAuth);
        }
        if (validation) {
            if (Array.isArray(validation)) {
                middlewares.push(...validation);
            } else {
                middlewares.push(validation);
            }
        }
        middlewares.push(controller);
        prefix[method](path, ...middlewares);
    })

    return prefix;
}
export const deleteSingleFile = async (file: any, filepath: string) => {
    try {
        const filename = path.basename(file);
        //filepath = 'uploads/images/'
        if (fs.existsSync(filepath + filename) && filename != '') {
            await fs.unlinkSync(filepath + filename);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log("un link single file : ", e);
        return false;
    }
}
export const deleteMultipleFile = async (files: any) => {

    await Promise.all(
        files.map(async (file: any) => {
            try {
                const filename = path.basename(file);
                if (fs.existsSync('uploads/images/' + filename) && filename != '') {
                    await fs.unlinkSync('uploads/images/' + filename);
                    return true;
                } else {
                    return false;
                }
            } catch (e) {

            }
        })
    )

}
export const commonFileStorage = (destination: any) => multer.diskStorage({
    destination: (request: Request, file: any, callback: DestinationCallback): void => {
        callback(null, destination)
    },

    filename: (req: Request, file: any, callback: FileNameCallback): void => {
        if (destination == "./uploads/images") { callback(null, "logo" + path.extname(file.originalname)) }
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname))
    }
})
export default {
    getCurrentUTC,
    sendSuccess,
    sendError,
    formattedErrors,
    getRootDir,
    getHomeDir,
    getPubDir,
    formatDate,
    uploadImage,
    routeArray,
    sendAdminSuccess,
    sendAdminError,

    deleteSingleFile,
    deleteMultipleFile,
    categoryFileStorage,
    commonFileStorage,
    fileFilterSupport
}