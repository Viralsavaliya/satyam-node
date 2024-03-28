import { AppStrings } from "../../../utils/appStrings";
// const User = require("../../users/models/userModel");
import { NextFunction, query, Request, Response } from "express";
import commonUtils, { fileFilter, commonFileStorage } from "../../../utils/commonUtils";
const _ = require("underscore");
const multer = require("multer");
const Grocery = require("../groceryItem/groceryItemModel");
const FoodItem = require("../foodItem/foodItemModel");
const Ngo = require("../ngo/ngoModel");
const Event = require("../events/eventmodel");
const Travel = require("../travel/travelModel");
const Vendor = require("../vendor/vendorModel");
const mongoose = require("mongoose");

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;
    let destination = "./uploads/images";
    if (type == "category") {
        destination = "./uploads/category"
    } else if (type == "user") {
        destination = "./uploads/user"
    } else if (type == "mainCategory") {
        destination = "./uploads/mainCategory"
    } else if (type == "subCategory") {
        destination = "./uploads/subCategory"
    } else if (type == "restaurant") {
        destination = "./uploads/restaurant"
    } else if (type == "foodItem") {
        destination = "./uploads/foodItem"
    } else if (type == "foodCategory") {
        destination = "./uploads/foodCategory"
    } else if (type == "vendor") {
        destination = "./uploads/vendor"
    } else if (type == "vendorKYC") {
        destination = "./uploads/vendorKYC"
    } else if (type == "admin") {
        destination = "./uploads/admin"
    } else if (type == "groceryCategory") {
        destination = "./uploads/groceryCategory"
    } else if (type == "groceryItem") {
        destination = "./uploads/groceryItem"
    } else if (type == "foodSubCategory") {
        destination = "./uploads/foodSubCategory"
    } else if (type == "groceryMenu") {
        destination = "./uploads/groceryMenu"
    } else if (type == "foodMenu") {
        destination = "./uploads/foodMenu"
    } else if (type == "eventImage") {
        destination = "./uploads/eventImage"
    } else if (type == "ngoItems") {
        destination = "./uploads/ngoItems"
    } else if (type == "travelmenu") {
        destination = "./uploads/travelmenu"
    } else if (type == "logo") {
        destination = "./uploads/images"
    } else if (type == "support") {
        destination = "./uploads/supportTicketAttachment"
    } else if (type == "advertisement") {
        destination = "./uploads/advertisement"
    } else if (type == "tickets") {
        destination = "./uploads/tickets"
    }
    const image_ = multer({
        storage: commonFileStorage(destination),
        fileFilter: fileFilter,
    }).single("image");



    image_(req, res, async (err: any) => {
        // console.log(err);
        if (err) return commonUtils.sendError(req, res, { message: err.message }, 409);
        if (!req.file) return commonUtils.sendError(req, res, { message: AppStrings.IMAGE_NOT_FOUND }, 409);
        const image_name = req.file.filename;
        return commonUtils.sendSuccess(req, res, {
            file_name: image_name,
        }, 200);
    });
}

export default {
    uploadImage,
}