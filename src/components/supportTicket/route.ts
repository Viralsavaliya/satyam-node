import supportTicketController from "./supportTicketController";
import V from "./validation";

export default [ 
    {
        path: "/getSupportTicket",
        method: "get",
        controller: supportTicketController.getSupportTicket,
    },   
    {
        path: "/supportchangeStatus/:id",
        method: "put",
        controller: supportTicketController.changeStatus,
    },  
    {
        path: "/getTicketDetail/:id",
        method: "get",
        controller: supportTicketController.getTicketDetail,
    },  
    {
        path: "/getMessages/:id",
        method: "get",
        controller: supportTicketController.getMessages,
    },  
    {
        path: "/sendMessage",
        method: "post",
        controller: supportTicketController.sendMessage,
    },  
];