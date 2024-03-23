var morgan = require('morgan');
import path from "path";
const config = require("config");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const _ = require("underscore");
const __ = require("lodash");
const rateLimit = require('express-rate-limit');

import { NextFunction, Request, Response } from "express";
import corsOptions from "./utils/corsOptions";
import commoncontroller from "./components/common/commoncontroller";

import adminRoute from "./components/admin/index";
// import adminRoute from "./components/admin";
import userRoute from "./components/user";
import postRoute from "./components/post";
import followRoute from "./components/follow";
import likeRoute from "./components/like";
import contactRoute from "./components/contactUs";
import subscriptionRoute from "./components/subscription";
import aboutRoute from "./components/aboutUs";
import supportRoute from "./components/supportTicket";
import cmsRoute from "./components/cms";
import settingRoute from "./components/userSetting";
import reportRoute from "./components/report";
import webhookController from "./components/subscription/webhookController";
import subscriptionController from "./components/subscription/subscriptionController";
// import commonController from "./components/common/commonController";
const log4js = require("log4js");

/* for prevent crash */
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})

log4js.configure({
    appenders: {
        console: {
            "type": "console",
            "category": "console"
        },
        everything: {
            type: 'dateFile',
            pattern: "yyyy-MM-dd",
            keepFileExt: true,  //
            maxLogSize: 1024 * 1024 * 1, //1024 * 1024 * 1 = 1M
            alwaysIncludePattern: true,     //
            daysToKeep: 3, //
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

express.application.prefix = express.Router.prefix = function (path: any, configure: any) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};

const app = express()
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// set request limit
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Allow only 5 request per minute
});

const userRouter = express.Router();
userRouter.use(apiLimiter);

app.use(cors(corsOptions))
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads/')))

app.use(morgan('dev', { skip: (req: any, res: any) => process.env.NODE_ENV === 'production' }));

const http = require('http');
const server = http.createServer(app);
/* API Routes */
app.get("/test", function (req: Request, res: Response, next: NextFunction) {
    res.send("success")
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

app.get('/api/apple-app-site-association', (req: any, res: any) => {
    const data: any = {
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
            "apps": [

            ],
            "details": [
                {
                    "appID": "KDN6755NM3.com.whitetailtactical.trading",
                    "paths": [
                        "*"
                    ]
                }
            ]
        }
    }
    res.set('Content-Type', 'application/pkcs7-mime')
    return res.status(200).send(data);
})

// app.prefix("/admin", (route: any) => {
//     adminRoute(route);
// });
app.prefix("/api/admin", (route: any) => {
    adminRoute(route);
    contactRoute(route);
    aboutRoute(route);
    supportRoute(route);
    cmsRoute(route);
});
app.prefix("/api/user", (route: any) => {
    userRoute(route);
});
app.prefix("/api/post", (route: any) => {
    postRoute(route);
});
app.prefix("/api/setting", (route: any) => {
    settingRoute(route);
});
app.prefix("/api", (route: any) => {
    followRoute(route);
    likeRoute(route);
    subscriptionRoute(route);
    reportRoute(route);
});

// var os = require("os");

server.listen(config.get("PORT"), () => {
    // var hostname = os.hostname();
    // console.log({hostname})
    console.log(`⚡️[NodeJs server]: Server is running at http://localhost:${config.get("PORT")}`)

    mongoose.connect(
        config.get("DB_CONN_STRING"),
        () => console.log('connected to mongodb.')
    );
    // redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
});