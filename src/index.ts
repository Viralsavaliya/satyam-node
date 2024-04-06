require('dotenv').config()
var morgan = require('morgan');
import path from "path";
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const _ = require("underscore");
const __ = require("lodash");

import { NextFunction, Request, Response } from "express";
import corsOptions from "./utils/corsOptions";

import adminRoute from "./components/admin/index";
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
const Admin = require('../src/components/admin/models/adminModel');

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

app.use(cors(corsOptions))
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use('/uploads', express.static(path.join(__dirname, '../uploads/')))

app.use(morgan('dev'));

const http = require('http');
const server = http.createServer(app);

app.get("/", async function (req: Request, res: Response, next: NextFunction) {
    const admins = await Admin.findOne()
    return res.send({ admins })
});

app.get("/ping", function (req: Request, res: Response, next: NextFunction) {
    res.send("PONG......🏓")
});

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

server.listen(process.env.PORT, () => {
    console.log(`⚡️[NodeJs server]: Server is running at http://localhost:${process.env.PORT}`)

    mongoose.connect(
        process.env.DB_CONN_STRING,
        () => console.log('connected to mongodb.')
    );
});