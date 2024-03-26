"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var morgan = require('morgan');
const path_1 = __importDefault(require("path"));
const config = require("config");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const _ = require("underscore");
const __ = require("lodash");
const rateLimit = require('express-rate-limit');
const corsOptions_1 = __importDefault(require("./utils/corsOptions"));
const index_1 = __importDefault(require("./components/admin/index"));
// import adminRoute from "./components/admin";
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
// import commonController from "./components/common/commonController";
const log4js = require("log4js");
/* for prevent crash */
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
            // maxLogSize: 10485760,
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
// set request limit
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5, // Allow only 5 request per minute
});
const userRouter = express.Router();
userRouter.use(apiLimiter);
app.use(cors(corsOptions_1.default));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path_1.default.join(__dirname, '../uploads/')));
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'production' }));
const http = require('http');
const server = http.createServer(app);
/* API Routes */
app.get("/", function (req, res, next) {
    res.send("success");
});
/* common image upload */
// app.post("/api/uploadImage/:type", async function (req: Request, res: Response, next: NextFunction) {
//     await commoncontroller.uploadImage(req, res, next);
// });
// app.post("/api/uploadSupportFiles", async function (req: Request, res: Response, next: NextFunction) {
//     await commoncontroller.uploadSupportFiles(req, res, next);
// });
// app.use('/api/inAppPurchase', userRouter);
// app.post("/api/inAppPurchase", async function (req: Request, res: Response) {
//     await subscriptionController.inAppPurchase(req, res);
// });
// app.post("/api/webHook", express.raw({ type: 'application/json' }), async function (req: Request, res: Response) {
//     await webhookController.webHook(req, res);
// })
// app.post("/inAppWebhookNew", express.raw({ type: 'application/json' }), async function (req: Request, res: Response) {
//     await webhookController.inAppWebhook(req, res);
// })
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
// app.prefix("/admin", (route: any) => {
//     adminRoute(route);
// });
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
// var os = require("os");
server.listen(config.get("PORT"), () => {
    // var hostname = os.hostname();
    // console.log({hostname})
    console.log(`⚡️[NodeJs server]: Server is running at http://localhost:${config.get("PORT")}`);
    mongoose.connect(config.get("DB_CONN_STRING"), () => console.log('connected to mongodb.'));
    // redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
});
