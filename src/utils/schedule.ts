import { Agenda } from 'agenda';
// import { JobStatus } from './enum';
// const JobManagement = require('../components/jobManagment/jobManagmentModel');
// const Job = require('../components/jobs/jobModel');
const config = require("config");
// const activeStatus = [JobStatus.ACCEPT_BY_PROVIDER,JobStatus.ACCEPT_BY_SEEKER]            
const Mongoose = require("mongoose");
const _ = require("underscore");
const __ = require("lodash");
// const OneSignal = require("onesignal-node");
// const client = new OneSignal.Client(config.APP_Id, config.API_Key);
const agenda = new Agenda({ db: { address: config.get("DB_CONN_STRING") } });
const Order = require("../components/order/orderModel");
const Token = require('../components/common/tokenModel');
// agenda.define('orderStatus',
//   async (job: any) => {
// const { order_id } = job.attrs.data;
//     const orderManagement = await Order.findById(order_id);
//     if (orderManagement && orderManagement.order_status === 0) {

//       const notification = {
//         contents: {
//           en: "A New BOOZOOM! Order is available!",
//         },
//         data: {
//           order_id: order_id,
//           type: 1, //Type 1 for Shop
//         },
//         priority: 10,
//         content_available: false,
//         included_segments: ["BooZoom"],
//         filters: [{ field: "tag", key: "shops", value: "all" }]
//       };
//       try {
//         const response = await client.createNotification(notification);
//       } catch (e) {
//         if (e instanceof OneSignal.HTTPError) {

//           console.log(e);
//         }
//       }
//     }
//   }
// )

// agenda.define('completeStatus',
//     async (job:any) => {
//         const {management_id} = job.attrs.data;
//         const jobManagement = await JobManagement.findById(management_id);
//         if(jobManagement && jobManagement.jobStatus === JobStatus.ACTIVE){                
//             jobManagement.jobStatus = JobStatus.COMPLETED;
//             jobManagement.save({userType:"🤖"});
//         }
//     }
// )

// agenda.define('verifyOtp',
//     async (verify: any) => {
//         const token = verify.attrs.data.verify;
//         const verifyToken = await Token.findOne({ token: token });
//         const currentTime = new Date();
//         if (verifyToken.end_time <= currentTime) {
//             verifyToken.otp = "";
//             verifyToken.save();
//         }


//     }
// )
// agenda.start();

export default agenda;