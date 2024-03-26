"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supportTicketController_1 = __importDefault(require("./supportTicketController"));
exports.default = [
    {
        path: "/getSupportTicket",
        method: "get",
        controller: supportTicketController_1.default.getSupportTicket,
    },
    {
        path: "/supportchangeStatus/:id",
        method: "put",
        controller: supportTicketController_1.default.changeStatus,
    },
    {
        path: "/getTicketDetail/:id",
        method: "get",
        controller: supportTicketController_1.default.getTicketDetail,
    },
    {
        path: "/getMessages/:id",
        method: "get",
        controller: supportTicketController_1.default.getMessages,
    },
    {
        path: "/sendMessage",
        method: "post",
        controller: supportTicketController_1.default.sendMessage,
    },
];
