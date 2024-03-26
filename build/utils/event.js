"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const emails_1 = __importDefault(require("../components/emails"));
const eventEmitter = new events_1.EventEmitter();
eventEmitter.on('send_register_otp', (data) => {
    emails_1.default.sendRegisterOTP(data.to, data.username, data.subject, data.otp, data.host);
});
eventEmitter.on('send_email_otp', (data) => {
    emails_1.default.sendForgetOTP(data.to, data.username, data.subject, data.data, data.host);
});
eventEmitter.on('send_mobile_otp', (data) => {
    emails_1.default.sendMobileOTP(data.subject, data.from, data.to);
});
exports.default = eventEmitter;
