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
exports.commonFileStorage = exports.deleteMultipleFile = exports.deleteSingleFile = exports.fileFilterSupport = exports.fileFilter = exports.categoryFileStorage = exports.fileStorage = void 0;
const appConstants_1 = require("./appConstants");
const moment_1 = __importDefault(require("moment"));
const encryptData_1 = __importDefault(require("../middlewares/secure/encryptData"));
const multer_1 = __importDefault(require("multer"));
const path = require('path');
const os = require('os');
const md5 = require("md5");
const decryptData_1 = __importDefault(require("../middlewares/secure/decryptData"));
const validations_1 = __importDefault(require("../middlewares/validations"));
const fs = require("fs");
const getRootDir = () => path.parse(process.cwd()).root;
const getHomeDir = () => os.homedir();
const getPubDir = () => "./public";
function formatDate(date) {
    return (0, moment_1.default)(date).format(appConstants_1.AppConstants.DATE_FORMAT);
}
function sendSuccess(req, res, data, statusCode = 200) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.env === "test") {
            return res.status(statusCode).send(data);
        }
        let encData = yield encryptData_1.default.EncryptedData(req, res, data);
        return res.status(statusCode).send(encData);
    });
}
function sendAdminSuccess(req, res, data, statusCode = 200) {
    return __awaiter(this, void 0, void 0, function* () {
        return res.status(statusCode).send(data);
    });
}
function sendAdminError(req, res, data, statusCode = 422) {
    return __awaiter(this, void 0, void 0, function* () {
        return res.status(statusCode).send(data);
    });
}
function sendError(req, res, data, statusCode = 422) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (req.headers.env === "test") {
        //     return res.status(statusCode).send(data)
        // }
        // let encData = await encryptedData.EncryptedData(req, res, data)
        return res.status(statusCode).send(data);
    });
}
function getCurrentUTC(format = appConstants_1.AppConstants.DATE_FORMAT, addMonth = null, addSeconds = 0) {
    // console.log(moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    if (addMonth != null) {
        return moment_1.default.utc(new Date()).add(addMonth, 'M').format(format);
    }
    else if (addSeconds > 0) {
        return moment_1.default.utc(new Date()).add(addSeconds, 'seconds').format(format);
    }
    else {
        return moment_1.default.utc(new Date()).add().format(format);
    }
}
function formattedErrors(err) {
    let transformed = {};
    Object.keys(err).forEach(function (key, val) {
        transformed[key] = err[key][0];
    });
    return transformed;
}
exports.fileStorage = multer_1.default.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './src/uploads/images');
    },
    filename: (req, file, callback) => {
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname));
    }
});
exports.categoryFileStorage = multer_1.default.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './uploads/category');
    },
    filename: (req, file, callback) => {
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (request, file, callback) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp') {
        callback(null, true);
    }
    else {
        // callback(null, false)
        callback(new Error('Only .png, .jpg and .jpeg .webp format allowed!'));
    }
};
exports.fileFilter = fileFilter;
const fileFilterSupport = (request, file, callback) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        callback(null, true);
    }
    else {
        // callback(null, false)
        callback(new Error('Only .png, .jpg and .jpeg .webp .pdf .doc format allowed!'));
    }
};
exports.fileFilterSupport = fileFilterSupport;
const uploadImage = (req, res, next) => {
    const upload = (0, multer_1.default)({
        storage: exports.fileStorage,
        fileFilter: exports.fileFilter
    }).single('image');
    upload(req, res, (err) => {
        if (err) {
            return sendError(req, res, err);
        }
        next();
    });
};
const routeArray = (array_, prefix, isAdmin = false) => {
    // path: "", method: "post", controller: "",validation: ""(can be array of validation), 
    // isEncrypt: boolean (default true), isPublic: boolean (default false)
    array_.forEach((route) => {
        const method = route.method;
        const path = route.path;
        const controller = route.controller;
        const validation = route.validation;
        let middlewares = [];
        const isEncrypt = route.isEncrypt === undefined ? true : route.isEncrypt;
        const isPublic = route.isPublic === undefined ? false : route.isPublic;
        if (isEncrypt && !isAdmin) {
            middlewares.push(decryptData_1.default.DecryptedData);
        }
        if (!isPublic) {
            middlewares.push(validations_1.default.verifyToken);
        }
        if (route.isAdmin) { // check for admin login or not
            middlewares.push(decryptData_1.default.checkAdminAuth);
        }
        if (validation) {
            if (Array.isArray(validation)) {
                middlewares.push(...validation);
            }
            else {
                middlewares.push(validation);
            }
        }
        middlewares.push(controller);
        prefix[method](path, ...middlewares);
    });
    return prefix;
};
const deleteSingleFile = (file, filepath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filename = path.basename(file);
        //filepath = 'uploads/images/'
        if (fs.existsSync(filepath + filename) && filename != '') {
            yield fs.unlinkSync(filepath + filename);
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        console.log("un link single file : ", e);
        return false;
    }
});
exports.deleteSingleFile = deleteSingleFile;
const deleteMultipleFile = (files) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const filename = path.basename(file);
            if (fs.existsSync('uploads/images/' + filename) && filename != '') {
                yield fs.unlinkSync('uploads/images/' + filename);
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
        }
    })));
});
exports.deleteMultipleFile = deleteMultipleFile;
const commonFileStorage = (destination) => multer_1.default.diskStorage({
    destination: (request, file, callback) => {
        callback(null, destination);
    },
    filename: (req, file, callback) => {
        if (destination == "./uploads/images") {
            callback(null, "logo" + path.extname(file.originalname));
        }
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname));
    }
});
exports.commonFileStorage = commonFileStorage;
exports.default = {
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
    deleteSingleFile: exports.deleteSingleFile,
    deleteMultipleFile: exports.deleteMultipleFile,
    categoryFileStorage: exports.categoryFileStorage,
    commonFileStorage: exports.commonFileStorage,
    fileFilterSupport: exports.fileFilterSupport
};
