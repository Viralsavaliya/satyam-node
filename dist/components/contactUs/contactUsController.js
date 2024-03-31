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
const ContactUs = require("./contactUsModel");
const appStrings_1 = require("../../utils/appStrings");
// async function addContactUs(req: Request, res: Response) {
//     try {
//         const { address, email, phone } = req.body;
//         const contact = new ContactUs();
//         contact.mailAddress = address;
//         contact.email = email;
//         contact.phone = phone;
//         await contact.save();
//         return commonUtils.sendSuccess(req, res, { message: "contactus add successfully!" }, 200);
//     } catch (err: any) {
//         return commonUtils.sendError(req, res, { message: err.message }, 409);
//     }
// }
function addContactUs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { mailAddress, email, phone, name } = req.body;
            let contact = yield new ContactUs({
                name,
                mailAddress,
                email,
                phone
            });
            yield contact.save();
            return commonUtils_1.default.sendSuccess(req, res, contact, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
function getContactUs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contact = yield ContactUs.find().select("_id name mailAddress email phone").sort({ createdAt: -1 });
            return commonUtils_1.default.sendSuccess(req, res, contact, 200);
        }
        catch (err) {
            return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
        }
    });
}
const deleteContactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const deletecontactid = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.id;
        const deletedWork = yield ContactUs.findByIdAndDelete(deletecontactid);
        if (!deletedWork)
            return res.status(404).json({ message: appStrings_1.AppStrings.CONTACT_NOT_FOUND });
        return commonUtils_1.default.sendSuccess(req, res, { message: "Contact us deleted successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
const updateContactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const contantid = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.id;
        const contact = yield ContactUs.findById(contantid);
        if (!contact)
            return commonUtils_1.default.sendError(req, res, { message: appStrings_1.AppStrings.WORK_NOT_FOUND }, 409);
        const { name, email, phone, mailAddress } = req.body;
        const Name = name || contact.name;
        const Email = email || contact.email;
        const Phone = phone || contact.phone;
        const MailAddress = mailAddress || contact.mailAddress;
        if (name || email || phone) {
            contact.name = Name;
            contact.email = Email;
            contact.phone = Phone;
        }
        else {
            contact.mailAddress = MailAddress;
        }
        yield contact.save();
        return commonUtils_1.default.sendSuccess(req, res, { message: "Contact updated successfully!" }, 200);
    }
    catch (err) {
        return commonUtils_1.default.sendError(req, res, { message: err.message }, 409);
    }
});
exports.default = {
    addContactUs,
    getContactUs,
    deleteContactUs,
    updateContactUs
};
//# sourceMappingURL=contactUsController.js.map