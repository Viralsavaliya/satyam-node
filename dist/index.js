"use strict";
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
const rateLimit = require('express-rate-limit');
// import corsOptions from "./utils/corsOptions";
// import commoncontroller from "./components/common/commoncontroller
const log4js = require("log4js");
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
log4js.configure({
    appenders: {
        console: {
            "type": "console",
            "category": "console"
        },
        everything: {
            type: 'dateFile',
            pattern: "yyyy-MM-dd",
            keepFileExt: true,
            maxLogSize: 1024 * 1024 * 1,
            alwaysIncludePattern: true,
            daysToKeep: 3,
            filename: './logger/white-tail.log',
            backups: 3,
            compress: true,
            MaxNumberOfDays: 1
        }
    },
    "categories": {
        "default": {
            "appenders": [
                "everything",
                "console"
            ],
            "level": "ALL"
        }
    },
    "pm2": true,
    "replaceConsole": true
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
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
});
const userRouter = express.Router();
userRouter.use(apiLimiter);
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path_1.default.join(__dirname, '../uploads/')));
app.use(morgan('dev'));
const http = require('http');
const server = http.createServer(app);
app.get("/test", function (req, res, next) {
    res.send("success");
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
// app.prefix("/api/admin", (route: any) => {
//     adminRoute(route);
//     contactRoute(route);
//     aboutRoute(route);
//     supportRoute(route);
//     cmsRoute(route);
// });
// app.prefix("/api/user", (route: any) => {
//     userRoute(route);
// });
// app.prefix("/api/post", (route: any) => {
//     postRoute(route);
// });
// app.prefix("/api/setting", (route: any) => {
//     settingRoute(route);
// });
// app.prefix("/api", (route: any) => {
//     followRoute(route);
//     likeRoute(route);
//     subscriptionRoute(route);
//     reportRoute(route);
// });
server.listen(process.env.PORT, () => {
    console.log(`⚡️[NodeJs server]: Server is running at http://localhost:${process.env.PORT}`);
    mongoose.connect(process.env.DB_CONN_STRING, () => console.log('connected to mongodb.'));
});
//# sourceMappingURL=index.js.map