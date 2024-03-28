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
const appStrings_1 = require("../../../utils/appStrings");
const commonUtils_1 = __importStar(require("../../../utils/commonUtils"));
const _ = require("underscore");
const multer = require("multer");
const Grocery = require("../groceryItem/groceryItemModel");
const FoodItem = require("../foodItem/foodItemModel");
const Ngo = require("../ngo/ngoModel");
const Event = require("../events/eventmodel");
const Travel = require("../travel/travelModel");
const Vendor = require("../vendor/vendorModel");
const mongoose = require("mongoose");
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    let destination = "./uploads/images";
    if (type == "category") {
        destination = "./uploads/category";
    }
    else if (type == "user") {
        destination = "./uploads/user";
    }
    else if (type == "mainCategory") {
        destination = "./uploads/mainCategory";
    }
    else if (type == "subCategory") {
        destination = "./uploads/subCategory";
    }
    else if (type == "restaurant") {
        destination = "./uploads/restaurant";
    }
    else if (type == "foodItem") {
        destination = "./uploads/foodItem";
    }
    else if (type == "foodCategory") {
        destination = "./uploads/foodCategory";
    }
    else if (type == "vendor") {
        destination = "./uploads/vendor";
    }
    else if (type == "vendorKYC") {
        destination = "./uploads/vendorKYC";
    }
    else if (type == "admin") {
        destination = "./uploads/admin";
    }
    else if (type == "groceryCategory") {
        destination = "./uploads/groceryCategory";
    }
    else if (type == "groceryItem") {
        destination = "./uploads/groceryItem";
    }
    else if (type == "foodSubCategory") {
        destination = "./uploads/foodSubCategory";
    }
    else if (type == "groceryMenu") {
        destination = "./uploads/groceryMenu";
    }
    else if (type == "foodMenu") {
        destination = "./uploads/foodMenu";
    }
    else if (type == "eventImage") {
        destination = "./uploads/eventImage";
    }
    else if (type == "ngoItems") {
        destination = "./uploads/ngoItems";
    }
    else if (type == "travelmenu") {
        destination = "./uploads/travelmenu";
    }
    else if (type == "logo") {
        destination = "./uploads/images";
    }
    else if (type == "support") {
        destination = "./uploads/supportTicketAttachment";
    }
    else if (type == "advertisement") {
        destination = "./uploads/advertisement";
    }
    else if (type == "tickets") {
        destination = "./uploads/tickets";
    }
    const image_ = multer({
        storage: (0, commonUtils_1.commonFileStorage)(destination),
        fileFilter: commonUtils_1.fileFilter,
    }).single("image");
    image_(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(err);
        if (err)
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        if (!req.file)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.IMAGE_NOT_FOUND }, 409);
        const image_name = req.file.filename;
        return commonUtils_1.default.sendSuccess(req, res, {
            file_name: image_name,
        }, 200);
    }));
});
exports.default = {
    uploadImage,
};
//# sourceMappingURL=commonController.js.map