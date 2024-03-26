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
const commonUtils_1 = __importDefault(require("../../utils/commonUtils"));
const commoncontroller_1 = __importDefault(require("../common/commoncontroller"));
const Support = require("./supportTicketModel");
const SupportChat = require("./supportChatModel");
const User = require("../user/userModel");
const mongoose = require("mongoose");
function getSupportTicket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const support = yield Support.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user_data'
                    },
                },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        files: 1,
                        subject: 1,
                        description: 1,
                        status: 1,
                        createdAt: 1,
                        user_name: { $concat: ['$user_data.firstname', ' ', '$user_data.lastname'] },
                    }
                }
            ]);
            return commonUtils_1.default.sendSuccess(req, res, support, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function changeStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const support = yield Support.findOne({ _id: req.params.id });
            support.status = 2;
            yield support.save();
            if (support.status == 2) {
                const user = yield User.findOne({ _id: support.user_id });
                const auth_id = null;
                const noti_type = 4;
                const msg = {
                    notification: {
                        title: "Support Ticket",
                        body: "Admin complete your ticket"
                    },
                    data: {
                        id: String(support._id),
                        status: String(2),
                        type: String(4)
                    }
                };
                yield commoncontroller_1.default.sendNotification(auth_id, user, msg, noti_type);
            }
            return commonUtils_1.default.sendSuccess(req, res, { message: "status change successfully!" }, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getTicketDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const support = yield Support.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user_data'
                    },
                },
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.params.id)
                    }
                },
                { $unwind: { path: "$user_data", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        files: 1,
                        subject: 1,
                        description: 1,
                        status: 1,
                        createdAt: 1,
                        user_name: { $concat: ['$user_data.firstname', ' ', '$user_data.lastname'] },
                    }
                }
            ]);
            if (!support) {
                return commonUtils_1.default.sendError(req, res, "Support record not found", 404);
            }
            return commonUtils_1.default.sendSuccess(req, res, support[0], 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const support = yield SupportChat.find({ support_ticket_id: new mongoose.Types.ObjectId(req.params.id) });
            if (!support) {
                return commonUtils_1.default.sendError(req, res, "Support record not found", 404);
            }
            return commonUtils_1.default.sendSuccess(req, res, support, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { message, support_ticket_id, user_id, type } = req.body;
            const ticket = new SupportChat();
            ticket.support_ticket_id = support_ticket_id;
            ticket.sender_id = 1;
            ticket.receiver_id = user_id;
            ticket.message = message;
            ticket.type = type;
            yield ticket.save();
            let notify_msg;
            if (type == 1) {
                notify_msg = message;
            }
            else {
                notify_msg = "Admin send a photo";
            }
            const user = yield User.findOne({ _id: user_id });
            const auth_id = null;
            const noti_type = 4;
            const msg = {
                notification: {
                    title: "Support Ticket",
                    body: notify_msg
                },
                data: {
                    id: String(support_ticket_id),
                    status: String(1),
                    type: String(4)
                }
            };
            yield commoncontroller_1.default.sendNotification(auth_id, user, msg, noti_type);
            return commonUtils_1.default.sendSuccess(req, res, {}, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
exports.default = {
    getSupportTicket,
    changeStatus,
    getTicketDetail,
    getMessages,
    sendMessage
};
