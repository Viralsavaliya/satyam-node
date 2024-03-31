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
Object.defineProperty(exports, "__esModule", { value: true });
const appStrings_1 = require("../../utils/appStrings");
const commonUtils_1 = __importStar(require("../../utils/commonUtils"));
const _ = require("underscore");
const multer = require("multer");
// import sharp from 'sharp';
// import fs from 'fs';
const Notification = require('../notification/notificationModel');
// import admin from "../../utils/firebaseConfig";
const log4js = require("log4js");
const logger = log4js.getLogger();
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    let destination = "./uploads/images";
    if (type == "user") {
        destination = "./uploads/users";
    }
    else if (type == "post") {
        destination = "./uploads/posts";
    }
    else if (type == "admin") {
        destination = "./uploads/admin";
    }
    else if (type == "support") {
        destination = "./uploads/support";
    }
    const image_ = multer({
        storage: (0, commonUtils_1.commonFileStorage)(destination),
        fileFilter: commonUtils_1.fileFilter,
    }).single("image");
    image_(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        if (!req.file)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.IMAGE_NOT_FOUND }, 409);
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
        return commonUtils_1.default.sendSuccess(req, res, {
            file_name: image_name,
        }, 200);
    }));
});
const uploadSupportFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    let destination = "./uploads/support";
    const image_ = multer({
        storage: (0, commonUtils_1.commonFileStorage)(destination),
        fileFilter: commonUtils_1.fileFilterSupport,
    }).array("files");
    image_(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
        if (!req.files || req.files.length === 0) {
            return commonUtils_1.default.sendError(req, res, { message: "File not found" }, 409);
        }
        const image_names = req.files;
        var arr = [];
        image_names.map((ele) => {
            arr.push(ele.filename);
        });
        return commonUtils_1.default.sendSuccess(req, res, {
            arr,
        }, 200);
    }));
});
const sendNotification = (senderId, receiverId, message, type) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const notification = new Notification();
    notification.title = message.notification.title;
    notification.message = message.notification.body;
    notification.type = type;
    notification.data = message.data;
    notification.sender_id = senderId !== null && senderId !== void 0 ? senderId : null;
    notification.receiver_id = (_a = receiverId === null || receiverId === void 0 ? void 0 : receiverId._id) !== null && _a !== void 0 ? _a : null;
    yield notification.save();
    logger.info("sender-user-id", senderId);
    logger.info("receiver-user-id", receiverId === null || receiverId === void 0 ? void 0 : receiverId._id);
    logger.info("notification message", message);
    // if (receiverId.pushToken != null) {
    //     await admin.messaging().sendToDevice(receiverId.pushToken, message).then((response: any) => {
    //         console.log("success", response.results)
    //     }).catch((err: any) => {
    //         console.log({ err })
    //     });
    // }
});
const sendAllUserNotification = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = new Notification();
    notification.title = message.notification.title;
    notification.message = message.notification.body;
    notification.type = 5;
    notification.is_admin = true;
    yield notification.save();
    // await admin.messaging().send(message).then((response: any) => {
    //     console.log("success", response)
    //     //return commonUtils.sendSuccess(req, res, { message: "success" }, 200);
    // }).catch((err: any) => {
    //     console.log("error", err);
    // });
});
exports.default = {
    uploadImage,
    sendNotification,
    sendAllUserNotification,
    uploadSupportFiles
};
//# sourceMappingURL=commoncontroller.js.map