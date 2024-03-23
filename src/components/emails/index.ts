const nodemailer = require("nodemailer")
const config = require("config");
const ejs = require("ejs");
const path = require("path");
const mailgun = require("mailgun-js");

const mg = mailgun({ apiKey: "d895a2257a87127851a8349394794310-db137ccd-d08d9845", domain: "noreply.whitetail-tactical.com" });

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requiredTLS: true,
    auth: {
        // user: config.get("MAIL_USER"),
        // pass: config.get("MAIL_PASSWORD")
    }
});

const https = require('https');

// var request = require('request');

// let username = config.BULK_SMS_USERNAME;
// let password = config.BULK_SMS_PASSWORD;

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(config.SENDGRID_API_KEY);

// const Twilio = require('twilio');
// let twilioClient = new Twilio(
//     config.TWILIO_API_KEY, config.TWILIO_API_SECRET, {accountSid: config.TWILIO_ACCOUNT_SID}
// );
// const client = require('twilio')    (config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
//console.log(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);


const sendRegisterOTP = async (email: string, username: string, subject: string, otp: any, host: string) => {
    // try {
    //     const location_file = path.join(__dirname + '/../emails/verificationEmail.ejs')
    //     const logo = config.get("LOGO_PATH_LOCAL") + config.get("LOGO_PATH");//"/uploads/images/logo.svg";
    //     ejs.renderFile(location_file, { name: username, email: email, otp: otp, subject: subject, logo: logo }, async function (err: any, data: any) {
    //         if (err) {
    //             console.log(111, err);
    //         } else {
    //             const msg = {
    //                 to: email,
    //                 from: 'WhiteTail<noreply@whitetail-tactical.com>',
    //                 subject: subject,
    //                 html: data
    //             };
    //             // (async () => {
    //             //     try {
    //             //         await sgMail.send(msg);
    //             //     } catch (error: any) {
    //             //         console.error(222, error.message);
    //             //         if (error.response) {
    //             //             console.error(error.response.body)
    //             //         }
    //             //     }
    //             // })();
    //             mg.messages().send(msg, (error: any, body: any) => {
    //                 if (error) {
    //                     console.error("Error sending email:", error);
    //                 } else {
    //                     console.log("Email sent:", body);
    //                 }
    //             });
    //         }
    //     });
    // } catch (e) {
    //     console.log("catch erro ", e)
    // }
}

const sendForgetOTP = async (email: string, username: string, subject: string, data: any, host: string) => {
    try {
        const location_file = path.join(__dirname + '/../emails/forgetPasswordOtp.ejs')
        const logo = config.get("LOGO_PATH_LOCAL") + config.get("LOGO_PATH");//"/uploads/images/logo.svg";
        ejs.renderFile(location_file, { name: username, email: email, otp: data.otp, subject: subject, logo: logo }, async function (err: any, data: any) {
            if (err) {
                console.log(111, err);
            } else {
                // const msg = {
                //     to: email,
                //     from: 'WhiteTail<noreply@binoxbargains.com>',
                //     subject: subject,
                //     text: data.content,
                //     html: data
                // };
                // (async () => {
                //     try {
                //         await sgMail.send(msg);
                //     } catch (error: any) {
                //         console.error(222, error.message);
                //         if (error.response) {
                //             console.error(error.response.body)
                //         }
                //     }
                // })();

                const msg = {
                    from: "WhiteTail<brad@clustersort.com>",
                    to: email,
                    subject: subject,
                    text: data.content,
                    html: data
                };

                mg.messages().send(msg, (error: any, body: any) => {
                    if (error) {
                        console.error("Error sending email:", error);
                    } else {
                        console.log("Email sent:", body);
                    }
                });
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}
const sendMobileOTP = async (body: any, from: any, to: any) => {

    // try {
    //     // let test_body ="your binox verification code is " +body;
    //     let postData = JSON.stringify({
    //         'to': to,
    //         'body': body
    //     });

    //     let options = {
    //         hostname: 'api.bulksms.com',
    //         port: 443,
    //         path: '/v1/messages',
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Content-Length': postData.length,
    //             'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
    //         }
    //     };

    //     let req = https.request(options, (resp: any) => {
    //         //console.log('statusCode:', resp.statusCode);
    //         let data = '';
    //         resp.on('data', (chunk: any) => {
    //             data += chunk;
    //         });
    //         resp.on('end', () => {
    //             console.log("Response:", data);
    //         });
    //     });

    //     req.on('error', (e: any) => {
    //         console.log("err");
    //         console.error(e);
    //     });

    //     req.write(postData);

    //     req.end();
    // } catch (err: any) {
    //     console.log(err.message);
    // }

}

export default {
    sendRegisterOTP,
    sendForgetOTP,
    sendMobileOTP
}