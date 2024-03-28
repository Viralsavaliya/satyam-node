import AboutUsController from "./aboutUsController";
import V from "./validation";

export default [
    {
        path: "/addAboutUs",
        method: "post",
        controller: AboutUsController.addAboutUs,
        validation: V.addAboutValidation,
    },  
    {
        path: "/getAboutUs",
        method: "get",
        controller: AboutUsController.getAboutUs,
    },  
    {
        path: "/updateAboutUs/:id",
        method: "put",
        controller: AboutUsController.updateAboutUs,
        validation: V.updateAboutValidation,
    },  
    {
        path: "/aboutuschangeStatus/:id",
        method: "put",
        controller: AboutUsController.changeStatus,
    },  
];