import auth from "../../auth";
import SubscriptionController from "./subscriptionController";
import V from "./validation";

export default [
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
        controller: SubscriptionController.paymentHistory,
    },
    // {
    //     path: "/cancelSubscription",
    //     method: "get",
    //     controller: SubscriptionController.cancelSubscription,
    // },
    {
        path: "/paymentDetails",
        method: "post",
        controller: SubscriptionController.paymentDetails,
    },
    {
        path: "/paymentstatus",
        method: "get",
        controller: SubscriptionController.paymentstatus,
    },
    // {
    //     path: "/inAppPurchase",
    //     method: "post",
    //     controller: SubscriptionController.inAppPurchase,
    // },
    {
        path: "/addTransactionData",
        method: "post",
        controller: SubscriptionController.addTransactionData,
    },
    // {
    //     path: "/planList",
    //     method: "get",
    //     controller: SubscriptionController.planList,
    // },
    {
        path: "/paymentstatusapple",
        method: "get",
        controller: SubscriptionController.paymentstatuswithapple,
    },
];