import commonUtils from "../../utils/commonUtils";
import { Request, Response } from "express";

const ContactUs = require("./contactUsModel");
import { AppStrings } from "../../utils/appStrings";

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

async function addContactUs(req: Request, res: Response) {
  try {
    const { mailAddress, email, phone, name } = req.body;
    let contact = await new ContactUs({
      name,
      mailAddress,
      email,
      phone
    });
    await contact.save();
    return commonUtils.sendSuccess(req, res, contact, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

async function getContactUs(req: Request, res: Response) {
  try {
    const contact = await ContactUs.find().select("_id name mailAddress email phone").sort({ createdAt: -1 });
    return commonUtils.sendSuccess(req, res, contact, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

const deleteContactUs = async (req: any, res: Response) => {
  try {
    const deletecontactid = req?.query?.id;

    const deletedWork = await ContactUs.findByIdAndDelete(deletecontactid);

    if (!deletedWork) return res.status(404).json({ message: AppStrings.CONTACT_NOT_FOUND });

    return commonUtils.sendSuccess(req, res, { message: "Contact us deleted successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

const updateContactUs = async (req: any, res: Response) => {
  try {
    const contantid = req?.query?.id;
    const contact = await ContactUs.findById(contantid);

    if (!contact) return commonUtils.sendError(req, res, { message: AppStrings.WORK_NOT_FOUND }, 409);

    const { name, email, phone, mailAddress } = req.body;

    const Name = name || contact.name;
    const Email = email || contact.email;
    const Phone = phone || contact.phone;
    const MailAddress = mailAddress || contact.mailAddress;

    if (name || email || phone) {
      contact.name = Name;
      contact.email = Email;
      contact.phone = Phone;
    } else {
      contact.mailAddress = MailAddress;
    }

    await contact.save();
    return commonUtils.sendSuccess(req, res, { message: "Contact updated successfully!" }, 200);
  } catch (err: any) {
    return commonUtils.sendError(req, res, { message: err.message }, 409);
  }
}

export default {
  addContactUs,
  getContactUs,
  deleteContactUs,
  updateContactUs
}