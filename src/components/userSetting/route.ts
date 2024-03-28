import settingController from "./settingController";
import V from "./validation";

export default [
    {
        path: "/",
        method: "post",
        controller: settingController.setting,
        validation: V.settingValidation,
    }, 
    {
        path: "/deleteAccount",
        method: "get",
        controller: settingController.deleteAccount,
        // validation: V.settingValidation,
    }, 
];