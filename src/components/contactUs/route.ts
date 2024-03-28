import ContactUsController from "./contactUsController";
import V from "./validation";

export default [
    {
        path: "/addContactUs",
        method: "post",
        controller: ContactUsController.addContactUs,
        validation: V.addPostValidation,
    },  
    {
        path: "/getContactUs",
        method: "get",
        controller: ContactUsController.getContactUs,
    },  
    {
        path: "/deletecontactus",
        method: "delete",
        controller: ContactUsController.deleteContactUs,
    },  
    {
        path: "/updateContactUs",
        method: "patch",
        controller: ContactUsController.updateContactUs,
        validation: V.updateValidation,
    },  
  
];