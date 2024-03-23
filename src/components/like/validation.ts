import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";

async function likeUnlikeValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "post_id": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function commentValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "post_id": "required",
        "comment": "required",
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {
    likeUnlikeValidation,
    commentValidation
}