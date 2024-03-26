"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionController_1 = __importDefault(require("./subscriptionController"));
exports.default = [
    // {
    //     path: "/createSubscription",
    //     method: "post",
    //     controller: SubscriptionController.createSubscription,
    //     validation: V.subscriptionValidation,
    //     isAdmin: true
    // },
    // {
    //     path: "/purchasePlan",
    //     method: "get",
    //     controller: SubscriptionController.purchasePlan,
    // },
    {
        path: "/paymentHistory",
        method: "get",
        controller: subscriptionController_1.default.paymentHistory,
    },
    // {
    //     path: "/cancelSubscription",
    //     method: "get",
    //     controller: SubscriptionController.cancelSubscription,
    // },
    {
        path: "/paymentDetails",
        method: "post",
        controller: subscriptionController_1.default.paymentDetails,
    },
    {
        path: "/paymentstatus",
        method: "get",
        controller: subscriptionController_1.default.paymentstatus,
    },
    // {
    //     path: "/inAppPurchase",
    //     method: "post",
    //     controller: SubscriptionController.inAppPurchase,
    // },
    {
        path: "/addTransactionData",
        method: "post",
        controller: subscriptionController_1.default.addTransactionData,
    },
    // {
    //     path: "/planList",
    //     method: "get",
    //     controller: SubscriptionController.planList,
    // },
    {
        path: "/paymentstatusapple",
        method: "get",
        controller: subscriptionController_1.default.paymentstatuswithapple,
    },
];
