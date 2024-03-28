import { EventEmitter } from 'events';
import Mail from "../components/emails";
const eventEmitter = new EventEmitter();

eventEmitter.on('send_register_otp', (data: any) => {
    Mail.sendRegisterOTP(data.to,data.username, data.subject,data.otp, data.host);
});

eventEmitter.on('send_email_otp', (data: any) => {
    Mail.sendForgetOTP(data.to,data.username, data.subject,data.data, data.host);
});

eventEmitter.on('send_mobile_otp', (data: any) => {
    Mail.sendMobileOTP(data.subject, data.from, data.to);
});

export default eventEmitter;