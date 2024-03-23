const config = require("config")

export const AppConstants = {
    "API_ROUTE_SOCKET": "",
    "USER_IMAGE_PATH": config.get("ROUTE_URL") + "/uploads/images/",

    "MODEL_USER": 'User',
    "MODEL_POST": "Post",
    "MODEL_SAVED_POST_FOLDER": "SavedPostFolder",
    "MODEL_SAVED_SHARED_POST": "SavedSharedPost",
    "MODEL_FOLLOW_FOLLOWERS": "FollowFollowers",
    "MODEL_LIKE": "Like",
    "MODEL_COMMENT": "Comment",
    "MODEL_WORK": "Work",
    "MODEL_TECHNIQUES": "techniques",
    "MODEL_SUBSCRIPTION": "Subscription",
    "MODEL_TEMPUSERSUBSCRIPTION": "TempUserSubscription",
    "MODEL_USER_SUBSCRIPTION": "UserSubscription",
    "MODEL_USER_BIL": "Bil",
    "MODEL_USER_AMOUNT": "item",
    "MODEL_COVER_IMAGE": "CoverImage",
    "MODEL_PROMO_CODE": "promocode",
    "MODEL_PROMO_CODE_USER": "PromoCodeUser",
    "MODEL_REPORT_SUBJECT": "ReportSubject",
    "MODEL_BLOCK_USER": "BlockUser",


    "MODEL_ADMIN": 'Admin',
    "MODEL_ROLE": 'Role',
    "MODEL_PERMISSION": 'Permission',
    "MODEL_CATEGORY": 'Category',
    "MODEL_FOOD_CATEGORY": 'FoodCategory',
    "MODEL_MAIN_CATEGORY": 'MainCategory',
    "MODEL_GROCERY_CATEGORY": "GroceryCategory",
    "MODEL_VENDOR": 'Vendor',
    "MODEL_TOKEN": 'Token',
    "MODEL_CHANGE_REQUEST": 'ChangeRequest',
    "MODEL_EVENT": "Event",
    "MODEL_NGO": "Ngo",
    "MODEL_TRAVEL": "Travel",
    "MODEL_CONTACT_US":'ContactUs',
    "TOKEN_EXPIRY_TIME": '10m',
    "DATE_FORMAT": "yyyy-MM-DD HH:mm:ss.SSS",
    "DATE_FORMAT_SHORT": "yyyy-MM-DD HH:mm:ss",

    "MODEL_RESTAURANT": 'Restaurant',
    "MODEL_FOOD_ITEM": "FoodItem",
    "MODEL_GROCERY_ITEM": "GroceryItem",

    "MODEL_FOOD_MENU": "FoodMenu",
    "MODEL_GROCERY_MENU": "GroceryMenu",

    "MODEL_VENDOR_ROLE": "VendorRole",
    "MODEL_VENDOR_PERMISSION": "VendorPermission",
    "MODEL_PAYOUT": "Payout",
    "MODEL_TRANSACTION": "Transaction",
    "MODEL_EVENT_TRANSACTION": "EventTransaction",
    "MODEL_APP_VERSION": "AppVersion",

    "MODEL_ORDER": "Order",
    "MODEL_NOTIFICATION": "Notification",
    "MODEL_USER_NOTIFICATION": "UserNotification",

    "MODEL_PAYMENT":"Payment",
    "MODEL_COUPON":"Coupon",
    "MODEL_ABOUT_US":'AboutUs',
    "MODEL_SUPPORT_TICKET":'SupportTicket',
    "MODEL_SUPPORT": "Support",
    "MODEL_CHAT_SUPPORT": "SupportChat",
    "MODEL_CART": "Cart",
    "MODEL_DISPUTED_ORDER": "DisputedOrder",
    "MODEL_ADMIN_FEE":"Adminfee",
    "MODEL_USER_FEEDBACK":"UserFeedback",
    "MODEL_CHARITY_DONATION":"NgoDonation",
    "MODEL_SUPPORT_SUBJECT" :"SupportSubject",
    "MODEL_CMSPAGES" :"CmsPage",
    "MODEL_ADVERTISEMENT" :"Advertisement",
    "MODEL_COUPON_CONSUMER" :"CouponConsumer",
    "MODEL_SETTINGPAGES" :"Setting",
    "MODEL_REPORT_POST" :"PostReport",
    "MODEL_REPORT_USER" :"UserReport",
}

declare global {
    interface String {
        isExists(): boolean;
        isEmpty(): boolean;
    }

    interface Number {
        isExists(): boolean;
    }

    interface Boolean {
        isExists(): boolean;
    }
}

String.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}
String.prototype.isEmpty = function () {
    return (this) == "";
}

Number.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}

Boolean.prototype.isExists = function () {
    return !(typeof (this) == 'undefined' || this == null);
}