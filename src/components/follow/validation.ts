import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";

async function followValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "follow_user_id": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function removefollowValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "user_id": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}


export default {
    followValidation,
    removefollowValidation
}