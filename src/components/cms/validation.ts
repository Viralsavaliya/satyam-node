import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";

async function addPostValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any;

    validationRule = {
        "name":"required",
        "email": "required",
        "phone": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}
async function updateValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any;

    validationRule = {
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {
    addPostValidation,
    updateValidation
}