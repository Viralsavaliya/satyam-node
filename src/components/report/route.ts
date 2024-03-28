import ReportController from "./reportController";
// import V from "./validation";

export default [
    {
        path: "/getPostReport",
        method: "get",
        controller: ReportController.getPostReport,
        // validation: V.savedPostValidation,
    },
    {
        path: "/postReport",
        method: "post",
        controller: ReportController.postReport,
        // validation: V.savedPostValidation,
    },
    {
        path: "/userReport",
        method: "post",
        controller: ReportController.userReport,
        // validation: V.savedPostValidation,
    },
];