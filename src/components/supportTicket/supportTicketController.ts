import commonUtils from "../../utils/commonUtils";
import { Request, Response } from "express";
import commoncontroller from "../common/commoncontroller";

const Support = require("./supportTicketModel");
const SupportChat = require("./supportChatModel");
const User = require("../user/userModel");
const mongoose = require("mongoose");

async function getSupportTicket(req: Request, res: Response) {
    try {
        const support = await Support.aggregate([
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
        ])
        return commonUtils.sendSuccess(req, res, support, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function changeStatus(req: Request, res: Response) {
    try {
        const support = await Support.findOne({ _id: req.params.id });
        support.status = 2;
        await support.save();

        if (support.status == 2) {
            const user = await User.findOne({ _id: support.user_id })
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

            await commoncontroller.sendNotification(auth_id, user, msg, noti_type)
        }

        return commonUtils.sendSuccess(req, res, { message: "status change successfully!" }, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function getTicketDetail(req: Request, res: Response) {
    try {
        const support = await Support.aggregate([
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
        ])

        if (!support) {
            return commonUtils.sendError(req, res, "Support record not found", 404);
        }

        return commonUtils.sendSuccess(req, res, support[0], 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function getMessages(req: Request, res: Response) {
    try {
        const support = await SupportChat.find({ support_ticket_id: new mongoose.Types.ObjectId(req.params.id) });

        if (!support) {
            return commonUtils.sendError(req, res, "Support record not found", 404);
        }

        return commonUtils.sendSuccess(req, res, support, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}
async function sendMessage(req: Request, res: Response) {
    try {
        const { message, support_ticket_id, user_id, type } = req.body;

        const ticket = new SupportChat();
        ticket.support_ticket_id = support_ticket_id;
        ticket.sender_id = 1;
        ticket.receiver_id = user_id;
        ticket.message = message;
        ticket.type = type;

        await ticket.save();

        let notify_msg: any;
        if (type == 1) {
            notify_msg = message;
        } else {
            notify_msg = "Admin send a photo";
        }

        const user = await User.findOne({ _id: user_id })
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

        await commoncontroller.sendNotification(auth_id, user, msg, noti_type)

        return commonUtils.sendSuccess(req, res, {}, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

export default {
    getSupportTicket,
    changeStatus,
    getTicketDetail,
    getMessages,
    sendMessage
}