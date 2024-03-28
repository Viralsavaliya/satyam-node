import { AppStrings } from "../../utils/appStrings";
import { NextFunction, Request, Response } from "express";
import commonUtils, { fileFilter, commonFileStorage, fileFilterSupport } from "../../utils/commonUtils";
const _ = require("underscore");
const multer = require("multer");
// import sharp from 'sharp';
// import fs from 'fs';
const Notification = require('../notification/notificationModel')
// import admin from "../../utils/firebaseConfig";
const log4js = require("log4js");
const logger = log4js.getLogger()

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;

    let destination = "./uploads/images";
    if (type == "user") {
        destination = "./uploads/users"
    } else if (type == "post") {
        destination = "./uploads/posts"
    } else if (type == "admin") {
        destination = "./uploads/admin"
    } else if (type == "support") {
        destination = "./uploads/support"
    }
    const image_ = multer({
        storage: commonFileStorage(destination),
        fileFilter: fileFilter,
    }).single("image");

    image_(req, res, async (err: any) => {
        if (err) return commonUtils.sendError(req, res, { message: err.message }, 409);
        if (!req.file) return commonUtils.sendError(req, res, { message: AppStrings.IMAGE_NOT_FOUND }, 409);
        const image_name = req.file.filename;

        // // Compress the uploaded image using sharp
        // const compressedImageBuffer = await sharp(req.file.path)
        //     .jpeg({ quality: 80 }) // Adjust the quality as needed
        //     .toBuffer();

        // // Store the compressed image buffer to disk

        // // Generate a unique filename
        // const image_name = `${Date.now()}_${req.file.filename}`;
        // const filePath = `${destination}/${image_name}`;

        // // Write the compressed image buffer to disk
        // await sharp(compressedImageBuffer)
        //     .toFile(filePath);

        // fs.unlinkSync(req.file.path);

        return commonUtils.sendSuccess(req, res, {
            file_name: image_name,
        }, 200);
    });
}

const uploadSupportFiles = async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;

    let destination = "./uploads/support";

    const image_ = multer({
        storage: commonFileStorage(destination),
        fileFilter: fileFilterSupport,
    }).array("files");

    image_(req, res, async (err: any) => {
        if (err) {
            return commonUtils.sendError(req, res, { message: err.message }, 409);
        }

        if (!req.files || req.files.length === 0) {
            return commonUtils.sendError(req, res, { message: "File not found" }, 409);
        }

        const image_names: any = req.files;

        var arr: any = [];

        image_names.map((ele: any) => {
            arr.push(ele.filename)
        })

        return commonUtils.sendSuccess(req, res, {
            arr,
        }, 200);


    });
}

const sendNotification = async (senderId: any, receiverId: any, message: any, type: any) => {

    const notification = new Notification();
    notification.title = message.notification.title;
    notification.message = message.notification.body;
    notification.type = type;
    notification.data = message.data;
    notification.sender_id = senderId ?? null;
    notification.receiver_id = receiverId?._id ?? null;
    await notification.save();

    logger.info("sender-user-id", senderId)
    logger.info("receiver-user-id", receiverId?._id)
    logger.info("notification message", message)

    // if (receiverId.pushToken != null) {
    //     await admin.messaging().sendToDevice(receiverId.pushToken, message).then((response: any) => {
    //         console.log("success", response.results)
    //     }).catch((err: any) => {
    //         console.log({ err })
    //     });
    // }
}
const sendAllUserNotification = async (message: any) => {

    const notification = new Notification();
    notification.title = message.notification.title;
    notification.message = message.notification.body;
    notification.type = 5;
    notification.is_admin = true;
    await notification.save();

    // await admin.messaging().send(message).then((response: any) => {
    //     console.log("success", response)
    //     //return commonUtils.sendSuccess(req, res, { message: "success" }, 200);
    // }).catch((err: any) => {
    //     console.log("error", err);
    // });
}

export default {
    uploadImage,
    sendNotification,
    sendAllUserNotification,
    uploadSupportFiles
}