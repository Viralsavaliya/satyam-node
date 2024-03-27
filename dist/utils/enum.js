"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatusEnum = exports.ReadRecipientEnum = exports.UserStoryPrivacyEnum = exports.msgType = exports.Gender = exports.ProviderType = exports.AdminRole = exports.UserType = exports.UserTypes = exports.Device = exports.WalletTransactionType = exports.ApplicationAction = exports.JobCancelType = exports.JobFrom = exports.DisputeStatus = exports.JobStatus = exports.IndustryType = exports.NotificationType = exports.PolicyTypes = exports.UserData = void 0;
var UserData;
(function (UserData) {
    UserData[UserData["NAME"] = 1] = "NAME";
    UserData[UserData["EMAIL"] = 2] = "EMAIL";
    UserData[UserData["MOBILE"] = 3] = "MOBILE";
    UserData[UserData["GOOGLE_ID"] = 4] = "GOOGLE_ID";
    UserData[UserData["FACEBOOK_ID"] = 5] = "FACEBOOK_ID";
    UserData[UserData["APPLE_ID"] = 6] = "APPLE_ID";
})(UserData = exports.UserData || (exports.UserData = {}));
var PolicyTypes;
(function (PolicyTypes) {
    PolicyTypes[PolicyTypes["TERMS"] = 1] = "TERMS";
    PolicyTypes[PolicyTypes["PRIVACY"] = 2] = "PRIVACY";
    PolicyTypes[PolicyTypes["DISCLAIMER"] = 3] = "DISCLAIMER";
})(PolicyTypes = exports.PolicyTypes || (exports.PolicyTypes = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["FOLLOWUNFOLLOW"] = 1] = "FOLLOWUNFOLLOW";
    NotificationType[NotificationType["POSTCREATE"] = 2] = "POSTCREATE";
    NotificationType[NotificationType["PLANPURCHASE"] = 3] = "PLANPURCHASE";
    NotificationType[NotificationType["SUPPORTTICKET"] = 4] = "SUPPORTTICKET";
    NotificationType[NotificationType["BULK"] = 5] = "BULK";
    NotificationType[NotificationType["LIKECOMMENT"] = 6] = "LIKECOMMENT";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
var IndustryType;
(function (IndustryType) {
    IndustryType[IndustryType["TRANSPORT"] = 1] = "TRANSPORT";
    IndustryType[IndustryType["EDUCATION"] = 2] = "EDUCATION";
})(IndustryType = exports.IndustryType || (exports.IndustryType = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus[JobStatus["OPEN"] = 1] = "OPEN";
    JobStatus[JobStatus["APPLYING"] = 2] = "APPLYING";
    JobStatus[JobStatus["ASSIGNED"] = 3] = "ASSIGNED";
    JobStatus[JobStatus["ACCEPT_BY_SEEKER"] = 4] = "ACCEPT_BY_SEEKER";
    JobStatus[JobStatus["ACCEPT_BY_PROVIDER"] = 5] = "ACCEPT_BY_PROVIDER";
    JobStatus[JobStatus["REJECT_BY_SEEKER"] = 6] = "REJECT_BY_SEEKER";
    JobStatus[JobStatus["REJECT_BY_PROVIDER"] = 7] = "REJECT_BY_PROVIDER";
    JobStatus[JobStatus["CANCEL_BY_SEEKER"] = 8] = "CANCEL_BY_SEEKER";
    JobStatus[JobStatus["CANCEL_BY_PROVIDER"] = 9] = "CANCEL_BY_PROVIDER";
    JobStatus[JobStatus["COMPLETED"] = 10] = "COMPLETED";
    JobStatus[JobStatus["REWORK"] = 11] = "REWORK";
    JobStatus[JobStatus["EXPIRED"] = 12] = "EXPIRED";
    JobStatus[JobStatus["HIRING"] = 13] = "HIRING";
    JobStatus[JobStatus["CANCELLED"] = 14] = "CANCELLED";
    JobStatus[JobStatus["ACTIVE"] = 15] = "ACTIVE";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));
var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus[DisputeStatus["DISPUTE_BY_SEEKER"] = 1] = "DISPUTE_BY_SEEKER";
    DisputeStatus[DisputeStatus["DISPUTE_BY_PROVIDER"] = 2] = "DISPUTE_BY_PROVIDER";
    DisputeStatus[DisputeStatus["APPROVED_BY_ADMIN"] = 3] = "APPROVED_BY_ADMIN";
    DisputeStatus[DisputeStatus["REJECT_BY_ADMIN"] = 4] = "REJECT_BY_ADMIN";
    DisputeStatus[DisputeStatus["REWORK"] = 5] = "REWORK";
    DisputeStatus[DisputeStatus["COMPLETED"] = 6] = "COMPLETED";
    DisputeStatus[DisputeStatus["CANCELLED"] = 7] = "CANCELLED";
})(DisputeStatus = exports.DisputeStatus || (exports.DisputeStatus = {}));
var JobFrom;
(function (JobFrom) {
    JobFrom[JobFrom["JOB_SEEKER"] = 1] = "JOB_SEEKER";
    JobFrom[JobFrom["JOB_PROVIDER"] = 2] = "JOB_PROVIDER";
    JobFrom[JobFrom["JOB_ADMIN"] = 3] = "JOB_ADMIN";
})(JobFrom = exports.JobFrom || (exports.JobFrom = {}));
var JobCancelType;
(function (JobCancelType) {
    JobCancelType[JobCancelType["POSTED"] = 1] = "POSTED";
    JobCancelType[JobCancelType["UPCOMING"] = 2] = "UPCOMING";
})(JobCancelType = exports.JobCancelType || (exports.JobCancelType = {}));
var ApplicationAction;
(function (ApplicationAction) {
    ApplicationAction[ApplicationAction["ACCEPT"] = 1] = "ACCEPT";
    ApplicationAction[ApplicationAction["REJECT"] = 2] = "REJECT";
})(ApplicationAction = exports.ApplicationAction || (exports.ApplicationAction = {}));
var WalletTransactionType;
(function (WalletTransactionType) {
    WalletTransactionType[WalletTransactionType["ADD_MONEY"] = 1] = "ADD_MONEY";
    WalletTransactionType[WalletTransactionType["SEND_MONEY"] = 2] = "SEND_MONEY";
    WalletTransactionType[WalletTransactionType["WITHDRAW_MONEY"] = 3] = "WITHDRAW_MONEY";
    WalletTransactionType[WalletTransactionType["TRANSFER_MONEY"] = 4] = "TRANSFER_MONEY";
    WalletTransactionType[WalletTransactionType["CREATE_JOB"] = 5] = "CREATE_JOB";
    WalletTransactionType[WalletTransactionType["COMPLETED_JOB"] = 6] = "COMPLETED_JOB";
    WalletTransactionType[WalletTransactionType["CANCEL_JOB"] = 7] = "CANCEL_JOB";
})(WalletTransactionType = exports.WalletTransactionType || (exports.WalletTransactionType = {}));
var Device;
(function (Device) {
    Device[Device["ANDROID"] = 1] = "ANDROID";
    Device[Device["IOS"] = 2] = "IOS";
    Device[Device["WEB"] = 3] = "WEB";
})(Device = exports.Device || (exports.Device = {}));
var UserTypes;
(function (UserTypes) {
    UserTypes[UserTypes["INDIVIDUAL"] = 1] = "INDIVIDUAL";
    UserTypes[UserTypes["BULK"] = 2] = "BULK";
    UserTypes[UserTypes["CORPORATE"] = 3] = "CORPORATE";
    UserTypes[UserTypes["RETAILER"] = 4] = "RETAILER";
    UserTypes[UserTypes["VENUE"] = 5] = "VENUE";
})(UserTypes = exports.UserTypes || (exports.UserTypes = {}));
var UserType;
(function (UserType) {
    UserType[UserType["SEEKER"] = 1] = "SEEKER";
    UserType[UserType["PROVIDER"] = 2] = "PROVIDER";
})(UserType = exports.UserType || (exports.UserType = {}));
var AdminRole;
(function (AdminRole) {
    AdminRole[AdminRole["SUPER_ADMIN"] = 40001] = "SUPER_ADMIN";
    AdminRole[AdminRole["DISPUTE_ADMIN"] = 80001] = "DISPUTE_ADMIN";
    AdminRole[AdminRole["WALLET_ADMIN"] = 60001] = "WALLET_ADMIN";
    AdminRole[AdminRole["JOB_ADMIN"] = 70001] = "JOB_ADMIN";
})(AdminRole = exports.AdminRole || (exports.AdminRole = {}));
var ProviderType;
(function (ProviderType) {
    ProviderType[ProviderType["COMPANY"] = 1] = "COMPANY";
    ProviderType[ProviderType["INDIVIDUAL"] = 2] = "INDIVIDUAL";
})(ProviderType = exports.ProviderType || (exports.ProviderType = {}));
var Gender;
(function (Gender) {
    Gender[Gender["MALE"] = 1] = "MALE";
    Gender[Gender["FEMALE"] = 2] = "FEMALE";
})(Gender = exports.Gender || (exports.Gender = {}));
var msgType;
(function (msgType) {
    msgType[msgType["TEXT"] = 1] = "TEXT";
    msgType[msgType["IMAGE"] = 2] = "IMAGE";
    msgType[msgType["AUDIO"] = 3] = "AUDIO";
    msgType[msgType["VIDEO"] = 4] = "VIDEO";
    msgType[msgType["LOCATION"] = 5] = "LOCATION";
    msgType[msgType["DOCUMENT"] = 6] = "DOCUMENT";
})(msgType = exports.msgType || (exports.msgType = {}));
var UserStoryPrivacyEnum;
(function (UserStoryPrivacyEnum) {
    UserStoryPrivacyEnum[UserStoryPrivacyEnum["MY_CONTACTS"] = 1] = "MY_CONTACTS";
    UserStoryPrivacyEnum[UserStoryPrivacyEnum["SHARE_ONLY_WITH"] = 2] = "SHARE_ONLY_WITH";
    UserStoryPrivacyEnum[UserStoryPrivacyEnum["MY_CONTACTS_EXCEPT"] = 3] = "MY_CONTACTS_EXCEPT";
})(UserStoryPrivacyEnum = exports.UserStoryPrivacyEnum || (exports.UserStoryPrivacyEnum = {}));
var ReadRecipientEnum;
(function (ReadRecipientEnum) {
    ReadRecipientEnum[ReadRecipientEnum["ON"] = 1] = "ON";
    ReadRecipientEnum[ReadRecipientEnum["OFF"] = 2] = "OFF";
})(ReadRecipientEnum = exports.ReadRecipientEnum || (exports.ReadRecipientEnum = {}));
var MessageStatusEnum;
(function (MessageStatusEnum) {
    MessageStatusEnum[MessageStatusEnum["PENDING"] = 0] = "PENDING";
    MessageStatusEnum[MessageStatusEnum["SENT"] = 1] = "SENT";
    MessageStatusEnum[MessageStatusEnum["DELIVERED"] = 2] = "DELIVERED";
    MessageStatusEnum[MessageStatusEnum["READ"] = 3] = "READ";
    MessageStatusEnum[MessageStatusEnum["FAILED"] = 4] = "FAILED";
})(MessageStatusEnum = exports.MessageStatusEnum || (exports.MessageStatusEnum = {}));
//# sourceMappingURL=enum.js.map