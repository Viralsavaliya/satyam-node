import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";

async function subscriptionValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "plan_name": "required",
        "price": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {
    subscriptionValidation
}