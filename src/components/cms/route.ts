import cmsController from "./cmsController";
import V from "./validation";

export default [
    {
        path: "/addCMS",
        method: "post",
        controller: cmsController.addCMS,
        // validation: V.addPostValidation,
    },  
    {
        path: "/getCMS",
        method: "get",
        controller: cmsController.getCMS,
    },  
];