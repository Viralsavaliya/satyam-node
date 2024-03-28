import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import { AppConstants } from "../../utils/appConstants";

async function settingValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any;

    validationRule = {
        "key": "required|string",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {
    settingValidation,
} 