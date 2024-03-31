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
require('dotenv').config();
var morgan = require('morgan');
const path_1 = __importDefault(require("path"));
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const _ = require("underscore");
const __ = require("lodash");
const corsOptions_1 = __importDefault(require("./utils/corsOptions"));
const index_1 = __importDefault(require("./components/admin/index"));
const user_1 = __importDefault(require("./components/user"));
const post_1 = __importDefault(require("./components/post"));
const follow_1 = __importDefault(require("./components/follow"));
const like_1 = __importDefault(require("./components/like"));
const contactUs_1 = __importDefault(require("./components/contactUs"));
const subscription_1 = __importDefault(require("./components/subscription"));
const aboutUs_1 = __importDefault(require("./components/aboutUs"));
const supportTicket_1 = __importDefault(require("./components/supportTicket"));
const cms_1 = __importDefault(require("./components/cms"));
const userSetting_1 = __importDefault(require("./components/userSetting"));
const report_1 = __importDefault(require("./components/report"));
const Admin = require('../src/components/admin/models/adminModel');
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----');
    console.log(error);
    console.log('----- Exception origin -----');
    console.log(origin);
});
process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----');
    console.log(promise);
    console.log('----- Reason -----');
    console.log(reason);
});
express.application.prefix = express.Router.prefix = function (path, configure) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};
const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors(corsOptions_1.default));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path_1.default.join(__dirname, '../uploads/')));
app.use(morgan('dev'));
const http = require('http');
const server = http.createServer(app);
app.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const admins = yield Admin.findOne();
        return res.send({ admins });
    });
});
app.get("/ping", function (req, res, next) {
    res.send("PONG......🏓");
});
app.get('/api/apple-app-site-association', (req, res) => {
    const data = {
        "activitycontinuation": {
            "apps": [
                "KDN6755NM3.com.whitetailtactical.trading"
            ]
        },
        "webcredentials": {
            "apps": [
                "KDN6755NM3.com.whitetailtactical.trading"
            ]
        },
        "applinks": {
            "apps": [],
            "details": [
                {
                    "appID": "KDN6755NM3.com.whitetailtactical.trading",
                    "paths": [
                        "*"
                    ]
                }
            ]
        }
    };
    res.set('Content-Type', 'application/pkcs7-mime');
    return res.status(200).send(data);
});
app.prefix("/api/admin", (route) => {
    (0, index_1.default)(route);
    (0, contactUs_1.default)(route);
    (0, aboutUs_1.default)(route);
    (0, supportTicket_1.default)(route);
    (0, cms_1.default)(route);
});
app.prefix("/api/user", (route) => {
    (0, user_1.default)(route);
});
app.prefix("/api/post", (route) => {
    (0, post_1.default)(route);
});
app.prefix("/api/setting", (route) => {
    (0, userSetting_1.default)(route);
});
app.prefix("/api", (route) => {
    (0, follow_1.default)(route);
    (0, like_1.default)(route);
    (0, subscription_1.default)(route);
    (0, report_1.default)(route);
});
server.listen(process.env.PORT, () => {
    console.log(`⚡️[NodeJs server]: Server is running at http://localhost:${process.env.PORT}`);
    mongoose.connect(process.env.DB_CONN_STRING, () => console.log('connected to mongodb.'));
});
//# sourceMappingURL=index.js.map