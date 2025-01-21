import { EventEmitter } from "events";
import  jwt  from 'jsonwebtoken';
import { sendMessage } from "../services/sendMessage.js";
export const eventEmitter = new EventEmitter()

eventEmitter.on("sendEmail",async(data)=>{
    const {email} = data;
    const token = jwt.sign({email},process.env.CONFIRM_EMAIL_SIGTRUE);
    const link = `http://localhost:${process.env.PORT}/users/confirmEmail/${token}`;
    const emailSender = await sendMessage(email,"confirm Email",`<a href="${link}">confirm email</a>`)
    if (!emailSender) {
        return next(new Error("failed to send email",{cause:500}))
    }
})