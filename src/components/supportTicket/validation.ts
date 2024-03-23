import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";
import { AppConstants } from "../../utils/appConstants";

async function addAboutValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any;

    validationRule = {
        "question": `required|string|min:3|max:255|exist:${AppConstants.MODEL_ABOUT_US},question`,
        "answer": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function updateAboutValidation(req: Request, res: Response, next: NextFunction) {
    let ValidationRule: any = {
        "question": "required|string|max:500|exist_value_admin:AboutUs,question," + req.params.id,
        "answer": "required|string|max:5000"
    }
    validator.validatorUtilWithCallback(ValidationRule, {}, req, res, next);
}

export default {
    addAboutValidation,
    updateAboutValidation
} 