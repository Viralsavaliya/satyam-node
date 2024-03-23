import { Request, Response } from "express";
import commonUtils from "../../utils/commonUtils";
import { AppStrings } from "../../utils/appStrings";
import commoncontroller from "../common/commoncontroller";
const config = require("config");
const mongoose = require("mongoose");
const Subscription = require('./subscriptionModel');
const User = require('../user/userModel');
const UserSubscription = require('./userSubscriptionModel');
const PromoCode = require('../admin/models/promocodeModel');
const UserPromoCode = require('./userPromoCodeModel');
const { format } = require('date-fns');
const TempUserSubscription = require('../subscription/TempUserSubscription');
const log4js = require("log4js");
const logger = log4js.getLogger();




function generateOrderId() {
    const min = 100000000000000; // Smallest 15-digit number
    const max = 999999999999999; // Largest 15-digit number

    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum.toString();
}

async function paymentHistory(req: Request, res: Response) {
    try {
        const page: number = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const history = await UserSubscription.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(req.headers.userid)
                },
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'subscription_id',
                    foreignField: '_id',
                    as: 'subscriptions_data'
                },
            },
            { $unwind: { path: "$subscriptions_data", preserveNullAndEmptyArrays: true } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    plan_name: "$subscriptions_data.plan_name",
                    price: "$subscriptions_data.price",
                    payment_status: 1,
                    createdAt: 1,
                    discount: {
                        // $ifNull: ["$coupon_id", 0], // Set discount to 0 if it's null
                        $cond: {
                            if: { $ne: ["$coupon_id", null] },
                            then: 10,
                            else: 0
                        }
                    },
                    total: {
                        $cond: {
                            if: { $ne: ["$coupon_id", null] },
                            // then: { $subtract: ["$subscriptions_data.price", 10] },
                            then: {
                                $subtract: [
                                    "$subscriptions_data.price",
                                    {
                                        $divide: [
                                            { $multiply: ["$subscriptions_data.price", 10] },
                                            100
                                        ]
                                    }
                                ]
                            },
                            else: "$subscriptions_data.price"
                        }
                        // $subtract: ["$subscriptions_data.price", 10]
                    }
                }
            }
        ]);

        return commonUtils.sendSuccess(req, res, history, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function paymentDetails(req: Request, res: Response) {
    try {
        const sub_id = req.body.user_sub_id

        const subDetails = await UserSubscription.findOne({ _id: new mongoose.Types.ObjectId(sub_id) });
        if (!subDetails) return commonUtils.sendError(req, res, { message: "Subscription plan details not found!" });

        const sub = await Subscription.findOne({ _id: new mongoose.Types.ObjectId(subDetails.subscription_id) })

        let discount_per = subDetails.discount ? subDetails.discount : 0;
        const discountAmount = (sub.price * discount_per) / 100;
        const discountedPrice = sub.price - discountAmount;

        const totalPrice = discountedPrice.toFixed(2);

        let response = {
            order_id: subDetails.order_id,
            date: subDetails.start_date,
            price: sub.price,
            expire_date: subDetails.end_date,
            discount: subDetails.discount,
            payment_status: subDetails.payment_status,
            total_price: Number(totalPrice),
            // currency: sub.currency
        }
        return commonUtils.sendSuccess(req, res, response, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}



async function addTransactionData(req: Request, res: Response) {
    logger.info("------------------addTransactionData call successfully-----------------")
    try {
        const { order_id, transaction_data } = req.body;
        logger.info({ order_id })
        logger.info({ transaction_data })

        const appleReceiptVerify = require('node-apple-receipt-verify');
        const receiptData = transaction_data;

        // Common initialization, later you can pass options for every request in options
        appleReceiptVerify.config({
            secret: "45b407c2e9b4453294d96e8cc9f8820a",
            environment: ['live']
        });

        // Callback version without device
        appleReceiptVerify.validate({
            receipt: receiptData
        }, async (err: any, products: any) => {
            if (err) {
                return commonUtils.sendError(req, res, { message: err }, 409);
            } else {
                let products_data = products[0];
                logger.info("products_data", products_data)

                const startFormattedDate = format(products_data.purchaseDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";
                const endFormattedDate = format(products_data.expirationDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";

                let subUser = await UserSubscription.findOne({ user_id: new mongoose.Types.ObjectId(req.headers.userid), order_id: order_id });
                if (!subUser) return commonUtils.sendError(req, res, { message: "Not found subscribed user!" }, 404);

                let findExistUser = await UserSubscription.findOne({ original_transaction_id: products_data.originalTransactionId, apple_product_id: products_data.productId, payment_status: 1, user_id: { $ne: new mongoose.Types.ObjectId(req.headers.userid) } });
                logger.info("findExistUserfindExistUser", findExistUser)
                if (findExistUser) {
                    logger.info('success')
                    return commonUtils.sendError(req, res, { message: "You have already subscribe this plan with this apple account!" }, 409);
                }

                let findSub = await Subscription.findOne({ _id: new mongoose.Types.ObjectId(subUser.subscription_id) });
                if (!findSub) return commonUtils.sendError(req, res, { message: "Not found subscription!" }, 404);

                let findTempData = await TempUserSubscription.findOne({ transaction_id: products_data.transactionId, apple_product_id: products_data.productId, original_transaction_id: products_data.originalTransactionId })
                if (findTempData) {
                    subUser.payment_status = 1; // running
                    subUser.transaction_status = "succeeded";

                    let findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(subUser.user_id) })
                    findUser.is_subscription = 1;
                    await findUser.save();
                }
                let discountedPrice: any = findSub.price;
                let discount: any = 0;

                if (subUser.coupon_id !== null) {
                    const originalPrice = findSub.price; // The original price in USD
                    discount = 10;
                    const discountAmount = (discount / 100) * originalPrice;
                    discountedPrice = originalPrice - discountAmount;
                }

                subUser.transaction_id = products_data.transactionId;
                subUser.original_transaction_id = products_data.originalTransactionId;
                subUser.apple_product_id = products_data.productId;
                subUser.start_date = startFormattedDate;
                subUser.end_date = endFormattedDate;
                await subUser.save();

                let response = {
                    _id: subUser._id,
                    order_id: subUser.order_id,
                    discount: discount,
                    start_date: subUser.start_date,
                    end_date: subUser.end_date,
                    payment_status: subUser.payment_status,
                    // transaction_status: "succeeded",
                    price: findSub.price,
                    total: discountedPrice
                }
                logger.info('response', response)
                return commonUtils.sendSuccess(req, res, response, 200);
            }
        });
    } catch (err: any) {
        logger.info("Error : addTransactionData", err)
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

async function paymentstatus(req: Request, res: Response) {
    try {
        logger.info("---------------------Payment Status----------------------")
        logger.info("payment_intent_id", req.query.payment_intent_id)
        let findSubUser = await UserSubscription.findOne({ payment_intent_id: req.query.payment_intent_id });
        if (!findSubUser) return commonUtils.sendError(req, res, { message: "Payment intent id is invalid!" }, 404);

        let findSub = await Subscription.findOne({ _id: new mongoose.Types.ObjectId(findSubUser.subscription_id) })
        if (!findSub) return commonUtils.sendError(req, res, { message: "Not found subscription!" }, 404);

        let discountedPrice: any = findSub.price;
        let discount: any = 0;

        if (findSubUser.coupon_id !== null) {
            const originalPrice = findSub.price; // The original price in USD
            discount = 10;
            const discountAmount = (discount / 100) * originalPrice;
            discountedPrice = originalPrice - discountAmount;
        }

        let response = {
            _id: findSubUser._id,
            order_id: findSubUser.order_id,
            start_date: findSubUser.start_date,
            end_date: findSubUser.end_date,
            payment_status: findSubUser.payment_status,
            discount: discount,
            price: findSub.price,
            total: discountedPrice
        }

        return commonUtils.sendSuccess(req, res, response, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}



async function paymentstatuswithapple(req: Request, res: Response) {
    try {
        if (!req.query.payment_intent_id && !req.query.order_id) {
            return commonUtils.sendError(req, res, { message: "payment intent id and order id are Required!" }, 400);
        }

        let findSubUser: any;

        if (req.query.payment_intent_id) {
            findSubUser = await UserSubscription.findOne({ payment_intent_id: req.query.payment_intent_id });
        } else if (req.query.order_id) {
            findSubUser = await UserSubscription.findOne({ order_id: req.query.order_id });
        }

        if (!findSubUser) return commonUtils.sendError(req, res, { message: "Payment intent id is invalid!" }, 404);

        let response = {
            payment_status: findSubUser.payment_status,
        }

        return commonUtils.sendSuccess(req, res, response, 200);
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}


export default {
    // purchasePlan,
    paymentHistory,
    paymentDetails,
    // cancelSubscription,
    // inAppPurchase,
    addTransactionData,
    paymentstatus,
    // planList,
    paymentstatuswithapple
}