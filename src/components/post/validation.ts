import { NextFunction, Request, Response } from "express"
import validator from "../../utils/validate";

async function savedPostValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any;

    if (req.body.folder_id == undefined && req.body.folder_name == undefined) {
        validationRule = {
            "folder_id": "required",
            "image": "required"
        }
    } else {
        validationRule = {
            "image": "required"
        }
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function sharedPostValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "image": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function deletePostValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "post_id": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function createFolderValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "folder_name": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

async function recentPostValidation(req: Request, res: Response, next: NextFunction) {
    let validationRule: any = {
        "post_id": "required"
    }
    validator.validatorUtilWithCallback(validationRule, {}, req, res, next);
}

export default {
    savedPostValidation,
    sharedPostValidation,
    deletePostValidation,
    createFolderValidation,
    recentPostValidation
}