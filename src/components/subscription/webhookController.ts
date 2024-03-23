import { Request, Response } from "express";
import commonUtils from "../../utils/commonUtils";
import commoncontroller from "../common/commoncontroller";

const { format } = require('date-fns');
const config = require("config");
const UserSubscription = require('../subscription/userSubscriptionModel');
const User = require('../user/userModel');
const TempUserSubscription = require('../subscription/TempUserSubscription');
const UserPromoCode = require('../subscription/userPromoCodeModel');
const mongoose = require("mongoose");
const log4js = require("log4js");
const logger = log4js.getLogger();

async function webHook(req: Request, res: Response) {
    logger.info("============== Webhook ==============");

    const endpointSecret = "whsec_WhxrBrvQ4hts241VkB8T8zb1bkUjKRck";
    let event: any;

    // try {
    //     const stripe = require('stripe')(config.get('STRIPE_SECRET'));

    //     const payloadString = JSON.stringify(req.body, null, 2);
    //     const secret = endpointSecret;

    //     const header = stripe.webhooks.generateTestHeaderString({
    //         payload: payloadString,
    //         secret,
    //     });

    //     event = stripe.webhooks.constructEvent(payloadString, header, secret);
    //     logger.info("event-type", event.type);
    // } catch (err: any) {
    //     logger.info(`Webhook Error: ${err.message}`)
    //     return res.status(400).send(`Webhook Error: ${err.message}`);
    // }
    let paymentIntentId: any = '';
    // try {
    //     switch (event.type) {
    //         case 'payment_intent.succeeded':

    //             paymentIntentId = event.data.object.id;
    //             logger.info("Succeeded paymentIntentId :", paymentIntentId)
    //             const userSubSucceed = await UserSubscription.findOne({ payment_intent_id: paymentIntentId });

    //             if (userSubSucceed) {
    //                 const currentDate = new Date();
    //                 const startFormattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";

    //                 currentDate.setFullYear(currentDate.getFullYear() + 1);
    //                 const endFormattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";

    //                 userSubSucceed.payment_status = 1; // running
    //                 userSubSucceed.start_date = startFormattedDate;
    //                 userSubSucceed.end_date = endFormattedDate;
    //                 userSubSucceed.transaction_status = event.data.object.status;
    //                 await userSubSucceed.save();

    //                 const findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(userSubSucceed.user_id) });

    //                 let findPromoCode = await UserPromoCode.findOne({ user_id: new mongoose.Types.ObjectId(userSubSucceed.user_id), status: 0 });

    //                 if (findUser) {
    //                     findUser.is_subscription = 1;

    //                     if (findPromoCode) {
    //                         findUser.is_coupon = 1;
    //                     }
    //                     await findUser.save();
    //                 }
    //                 const auth_id = null;
    //                 const type = 3;
    //                 const message = {
    //                     notification: {
    //                         title: "Subscription",
    //                         body: "Subscription's payment is succesfully received."
    //                     },
    //                     data: {
    //                         subscription_id: String(userSubSucceed._id),
    //                         type: String(3),
    //                         is_subscription: String(findUser.is_subscription),
    //                         payment_status: String(userSubSucceed.payment_status)
    //                     }
    //                 };
    //                 await commoncontroller.sendNotification(auth_id, findUser, message, type)
    //             } else {
    //                 logger.info(`Succeeded :: User subscription not found for payment intent ID: ${paymentIntentId}`);
    //             }
    //             break;
    //         case 'invoice.updated':

    //             let paymentInvoice = event.data.object;
    //             paymentIntentId = paymentInvoice.id;
    //             logger.info("paymentInvoice", paymentInvoice);

    //             if (paymentInvoice.billing_reason === 'subscription_cycle') {
    //                 const userSubUpdated = await UserSubscription.findOne({ payment_intent_id: paymentIntentId });
    //                 if (userSubUpdated) {
    //                     userSubUpdated.payment_status = 2; // updated
    //                     await userSubUpdated.save();

    //                     const currentDate = new Date();
    //                     const startFormattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";

    //                     currentDate.setFullYear(currentDate.getFullYear() + 1);
    //                     const endFormattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";

    //                     let newSub = await new UserSubscription({
    //                         user_id: userSubUpdated.user_id,
    //                         subscription_id: userSubUpdated.subscription_id,
    //                         stripe_subscription_id: paymentInvoice.subscription,
    //                         payment_intent_id: paymentInvoice.payment_intent,
    //                         start_date: startFormattedDate,
    //                         end_date: endFormattedDate,
    //                         transaction_status: "succeeded",
    //                         payment_status: 1,
    //                         order_id: generateOrderId()
    //                     })
    //                     await newSub.save();

    //                     let findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(newSub.user_id) })

    //                     const type = 3;
    //                     const auth_id = null;
    //                     const message = {
    //                         notification: {
    //                             title: "Subscription",
    //                             body: "Subscription's plan is renewed."
    //                         },
    //                         data: {
    //                             subscription_id: String(newSub._id),
    //                             type: String(3),
    //                             is_subscription: String(findUser.is_subscription),
    //                             payment_status: String(newSub.payment_status)
    //                         }
    //                     };
    //                     await commoncontroller.sendNotification(auth_id, findUser, message, type)
    //                 } else {
    //                     logger.info(`Invoice.updated :: User subscription not found for renew intent ID: ${paymentIntentId}`);
    //                 }
    //             } else {
    //                 logger.info(`Not found billing reason: ${paymentIntentId}`);
    //             }
    //             break;
    //         case 'payment_intent.payment_failed':

    //             paymentIntentId = event.data.object.id;
    //             logger.info("payment_failed", paymentIntentId)

    //             const userSubFailed = await UserSubscription.findOne({ payment_intent_id: paymentIntentId });

    //             if (userSubFailed) {
    //                 userSubFailed.payment_status = 3; // failed
    //                 await userSubFailed.save();

    //                 const findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(userSubFailed.user_id) });
    //                 const auth_id = null;
    //                 const type = 3;
    //                 const message = {
    //                     notification: {
    //                         title: "Subscription",
    //                         body: "Subscription's payment is failed."
    //                     },
    //                     data: {
    //                         subscription_id: String(userSubFailed._id),
    //                         type: String(3),
    //                         is_subscription: String(findUser.is_subscription),
    //                         payment_status: String(userSubFailed.payment_status)
    //                     }
    //                 };
    //                 await commoncontroller.sendNotification(auth_id, findUser, message, type)
    //             } else {
    //                 logger.info(`Failed :: User subscription not found for payment intent ID: ${paymentIntentId}`);
    //             }
    //             break;
    //         case 'customer.subscription.updated':

    //             let subscription = event.data.object;
    //             logger.info("subscription", subscription.id)

    //             if (subscription.status === 'incomplete_expired') {
    //                 let userSubUpdated = await UserSubscription.findOne({ stripe_subscription_id: subscription.id });
    //                 if (userSubUpdated) {
    //                     userSubUpdated.transaction_status = 'fail';
    //                     userSubUpdated.payment_status = 3; // failed
    //                     await userSubUpdated.save();
    //                 }

    //                 let findSubUser = await User.findOne({ _id: new mongoose.Types.ObjectId(userSubUpdated.user_id) });
    //                 if (findSubUser) {
    //                     findSubUser.is_subscription = 0;
    //                     await findSubUser.save();

    //                     const type = 3;
    //                     const auth_id = null;
    //                     const message = {
    //                         notification: {
    //                             title: "Subscription",
    //                             body: "Subscription's payment is fail."
    //                         },
    //                         data: {
    //                             subscription_id: String(userSubUpdated._id),
    //                             type: String(3),
    //                             is_subscription: String(findSubUser.is_subscription),
    //                             payment_status: String(userSubUpdated.payment_status)
    //                         }
    //                     };
    //                     logger.info("noti", message)
    //                     await commoncontroller.sendNotification(auth_id, findSubUser, message, type)
    //                 }
    //             }
    //             break;
    //         case 'customer.subscription.deleted':

    //             let subscriptions = event.data.object;
    //             logger.info("subscriptions : customer.subscription.deleted", subscriptions)
    //             if (subscriptions) {
    //                 let subscriptionDetails = await UserSubscription.findOne({ stripe_subscription_id: subscriptions.id })
    //                 logger.info("subscriptionDetails", subscriptionDetails)

    //                 const timestamp = subscriptions.canceled_at * 1000; // Convert seconds to milliseconds
    //                 const date = new Date(timestamp);
    //                 const endFormattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";

    //                 if (subscriptionDetails) {
    //                     subscriptionDetails.end_date = endFormattedDate;
    //                     subscriptionDetails.payment_status = 4;
    //                     subscriptionDetails.transaction_status = subscriptions.status;
    //                     await subscriptionDetails.save();

    //                     let findSubUser = await User.findOne({ _id: new mongoose.Types.ObjectId(subscriptionDetails.user_id) });
    //                     if (findSubUser) {
    //                         findSubUser.is_subscription = 0;
    //                         await findSubUser.save();

    //                         const type = 3;
    //                         const auth_id = null;
    //                         const message = {
    //                             notification: {
    //                                 title: "Subscription",
    //                                 body: "Subscription is canceled."
    //                             },
    //                             data: {
    //                                 subscription_id: String(subscriptionDetails._id),
    //                                 type: String(3),
    //                                 is_subscription: String(findSubUser.is_subscription),
    //                                 payment_status: String(subscriptionDetails.payment_status)
    //                             }
    //                         };
    //                         await commoncontroller.sendNotification(auth_id, findSubUser, message, type)
    //                     }
    //                 }
    //             }
    //             break;
    //         case 'payment_intent.canceled':

    //             paymentIntentId = event.data.object.id;
    //             const userSubCanceled = await UserSubscription.findOne({ payment_intent_id: paymentIntentId });

    //             if (userSubCanceled) {
    //                 userSubCanceled.transaction_status = event.data.object.status;
    //                 userSubCanceled.payment_status = 3; // fail
    //                 await userSubCanceled.save();
    //             }

    //             const findSubUser = await User.findOne({ _id: new mongoose.Types.ObjectId(userSubCanceled.user_id) });
    //             if (findSubUser) {
    //                 findSubUser.is_subscription = 0;
    //                 await findSubUser.save();

    //                 const type = 3;
    //                 const auth_id = null;
    //                 const message = {
    //                     notification: {
    //                         title: "Subscription",
    //                         body: "Subscription's payment is fail."
    //                     },
    //                     data: {
    //                         subscription_id: String(userSubCanceled._id),
    //                         type: String(3),
    //                         is_subscription: String(findSubUser.is_subscription),
    //                         payment_status: String(userSubCanceled.payment_status)
    //                     }
    //                 };
    //                 await commoncontroller.sendNotification(auth_id, findSubUser, message, type)
    //             }
    //             break;
    //         default:
    //             logger.info(`Unhandled event type: ${event.type}`);
    //     }
    //     res.status(200).end();
    // } catch (err: any) {
    //     return commonUtils.sendError(req, res, { message: err.message }, 409);
    // }
}

async function inAppWebhook(req: Request, res: Response) {
    logger.info("==============In App Webhook==============");

    const data = req.body;
    try {
        const tokenParts = data.signedPayload.split('.');
        const tokenPayload = Buffer.from(tokenParts[1], 'base64').toString();
        const jwtPayload = JSON.parse(tokenPayload);
        logger.info("jwtPayload", jwtPayload)

        const signedTransactionInfo = jwtPayload.data.signedTransactionInfo.split('.');
        const signedTransactionInfoPayload = Buffer.from(signedTransactionInfo[1], 'base64').toString();
        const signedTransactionInfoPayloadDecode = JSON.parse(signedTransactionInfoPayload);

        logger.info('Webhook decoded data', signedTransactionInfoPayloadDecode);

        const original_transaction_id = signedTransactionInfoPayloadDecode.originalTransactionId;
        const transaction_id = signedTransactionInfoPayloadDecode.transactionId;
        const plan_id = signedTransactionInfoPayloadDecode.productId;

        logger.info('Webhook transaction_id', transaction_id);
        logger.info('Webhook original transaction_id', original_transaction_id);
        logger.info('Webhook original transaction_id string', String(original_transaction_id));
        logger.info('Webhook plan_id', plan_id);

        let subscriptionDetail = await UserSubscription.findOne({ transaction_id: String(transaction_id), apple_product_id: String(plan_id) })
        logger.info("subscriptionDetail", subscriptionDetail);
        if (!subscriptionDetail) {
            // add data in temp table
            try {
                const newTempUserSubscription = await new TempUserSubscription({
                    transaction_id: transaction_id,
                    apple_product_id: plan_id,
                    original_transaction_id: original_transaction_id
                })
                await newTempUserSubscription.save()
                // return commonUtils.sendSuccess(req, res, { message: "TempUserSubscription created successfully!" }, 200);
            } catch (error: any) {
                logger.info("error", error)
                // return commonUtils.sendError(req, res, { message: error.message }, 409);
            }
        }

        logger.info("notification-Type1111", jwtPayload.notificationType)
        if (jwtPayload.notificationType == 'SUBSCRIBED') {

            subscriptionDetail.transaction_status = 'succeeded'
            subscriptionDetail.payment_status = 1 // running
            await subscriptionDetail.save();

            let findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(subscriptionDetail.user_id) })
            logger.info("findUser", findUser);

            let findPromoCode = await UserPromoCode.findOne({ user_id: new mongoose.Types.ObjectId(subscriptionDetail.user_id), status: 0 })

            findUser.is_subscription = 1;
            if (findPromoCode) {
                findPromoCode.status = 1;
                await findPromoCode.save();

                findUser.is_coupon = 1;
            }
            await findUser.save();

            const type = 3;
            const auth_id = null;
            const message = {
                notification: {
                    title: "Subscription",
                    body: "Subscription's payment is received."
                },
                data: {
                    subscription_id: String(subscriptionDetail._id),
                    type: String(3),
                    is_subscription: String(findUser.is_subscription),
                    payment_status: String(subscriptionDetail.payment_status)
                }
            };
            logger.info("noti", message)
            await commoncontroller.sendNotification(auth_id, findUser, message, type);

        } else if (jwtPayload.notificationType == 'CANCEL' || jwtPayload.notificationType == 'DID_CHANGE_RENEWAL_STATUS') {
            logger.info('DID_CHANGE_RENEWAL_STATUS')

            if (jwtPayload.subtype === 'AUTO_RENEW_DISABLED') {
                logger.info('AUTO_RENEW_DISABLED')
                let subscriptionDetails = await UserSubscription.findOne({ apple_product_id: String(plan_id), original_transaction_id: String(original_transaction_id), payment_status: 1 })
                if (subscriptionDetails) {
                    logger.info('true', subscriptionDetails)
                    subscriptionDetails.transaction_status = 'cancel'
                    subscriptionDetails.payment_status = 4 // cancel
                    await subscriptionDetails.save();
                    logger.info("updated subscriptionDetails", subscriptionDetails)
                    let findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(subscriptionDetails.user_id) })
                    findUser.is_subscription = 0;
                    await findUser.save();

                    const type = 3;
                    const auth_id = null;
                    const message = {
                        notification: {
                            title: "Subscription",
                            body: "Subscription's payment is canceled."
                        },
                        data: {
                            subscription_id: String(subscriptionDetails._id),
                            type: String(3),
                            is_subscription: String(findUser.is_subscription),
                            payment_status: String(subscriptionDetail.payment_status)
                        }
                    };
                    logger.info("noti", message)
                    await commoncontroller.sendNotification(auth_id, findUser, message, type)

                }
            } else if (jwtPayload.subtype === 'AUTO_RENEW_ENABLED') {
                logger.info('AUTO_RENEW_ENABLED');

                let subDetailForEnabled = await UserSubscription.findOne({ transaction_id: String(transaction_id), apple_product_id: String(plan_id) })
                if (subDetailForEnabled) {
                    subDetailForEnabled.transaction_status = 'succeeded'
                    subDetailForEnabled.payment_status = 1 // running
                    await subDetailForEnabled.save();

                    let findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(subDetailForEnabled.user_id) })
                    logger.info("findUser", findUser);

                    let findPromoCode = await UserPromoCode.findOne({ user_id: new mongoose.Types.ObjectId(subDetailForEnabled.user_id), status: 0 })

                    findUser.is_subscription = 1;
                    if (findPromoCode) {
                        findPromoCode.status = 1;
                        await findPromoCode.save();

                        findUser.is_coupon = 1;
                    }
                    await findUser.save();

                    const type = 3;
                    const auth_id = null;
                    const message = {
                        notification: {
                            title: "Subscription",
                            body: "Subscription's payment is received."
                        },
                        data: {
                            subscription_id: String(subDetailForEnabled._id),
                            type: String(3),
                            is_subscription: String(findUser.is_subscription),
                            payment_status: String(subDetailForEnabled.payment_status)
                        }
                    };
                    logger.info("noti", message)
                    await commoncontroller.sendNotification(auth_id, findUser, message, type)
                }
            }
        } else if (jwtPayload.notificationType == 'EXPIRED') {
            logger.info('EXPIRED')
            let subscriptionDetailsforExpire = await UserSubscription.findOne({ apple_product_id: String(plan_id), original_transaction_id: String(original_transaction_id), payment_status: 1 })
            logger.info("subscriptionDetailsforExpire", subscriptionDetailsforExpire)
            const expiry_date = signedTransactionInfoPayloadDecode.expiresDate;
            const endFormattedDate = format(expiry_date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";

            if (subscriptionDetailsforExpire) {
                subscriptionDetailsforExpire.end_date = endFormattedDate;
                subscriptionDetailsforExpire.transaction_status = 'expired'
                subscriptionDetailsforExpire.payment_status = 5 // expired
                await subscriptionDetailsforExpire.save();

                let findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(subscriptionDetailsforExpire.user_id) })
                findUser.is_subscription = 0;
                await findUser.save();

                const type = 3;
                const auth_id = null;
                const message = {
                    notification: {
                        title: "Subscription",
                        body: "Subscription's plan is expired."
                    },
                    data: {
                        subscription_id: String(subscriptionDetailsforExpire._id),
                        type: String(3),
                        is_subscription: String(findUser.is_subscription),
                        payment_status: String(subscriptionDetailsforExpire.payment_status)
                    }
                };
                logger.info("noti", message)
                await commoncontroller.sendNotification(auth_id, findUser, message, type)
            }
        } else if (jwtPayload.notificationType == 'DID_RENEW') {
            logger.info("DID_RENEW")
            let userOldSubscription = await UserSubscription.findOne({ apple_product_id: String(plan_id), original_transaction_id: String(original_transaction_id), payment_status: 1 })
            logger.info("userOldSubscription", userOldSubscription)

            if (userOldSubscription) {
                userOldSubscription.transaction_status = 'expired'
                userOldSubscription.payment_status = 5 // expired
                await userOldSubscription.save();
                logger.info('true', userOldSubscription)

                // let new_sub = await subscriptionController.inAppPurchase(req, res, plan_id, userOldSubscription.user_id)
                // logger.info({ new_sub })

                const startFormattedDate = format(signedTransactionInfoPayloadDecode.purchaseDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";
                const endFormattedDate = format(signedTransactionInfoPayloadDecode.expirationDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+00:00";

                let newSub = await new UserSubscription({
                    user_id: userOldSubscription.user_id,
                    subscription_id: userOldSubscription.subscription_id,
                    start_date: startFormattedDate,
                    end_date: endFormattedDate,
                    transaction_id: transaction_id,
                    original_transaction_id: original_transaction_id,
                    transaction_status: "succeeded",
                    payment_status: 1,
                    order_id: generateOrderId()
                })
                await newSub.save();
                logger.info("newSub", newSub)

                if (newSub) {
                    let findUser = await User.findOne({ _id: new mongoose.Types.ObjectId(newSub.user_id) })

                    const type = 3;
                    const auth_id = null;
                    const message = {
                        notification: {
                            title: "Subscription",
                            body: "Subscription's plan is renewed."
                        },
                        data: {
                            subscription_id: String(newSub._id),
                            type: String(3),
                            is_subscription: String(findUser.is_subscription),
                            payment_status: String(newSub.payment_status)
                        }
                    };
                    logger.info("noti", message)
                    await commoncontroller.sendNotification(auth_id, findUser, message, type)
                }
            }
        }
    } catch (err: any) {
        return commonUtils.sendError(req, res, { message: err.message }, 409);
    }
}

function generateOrderId() {
    const min = 100000000000000; // Smallest 15-digit number
    const max = 999999999999999; // Largest 15-digit number

    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum.toString();
}

export default {
    webHook,
    inAppWebhook
}