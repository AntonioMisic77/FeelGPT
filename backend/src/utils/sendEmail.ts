import nodemailer from 'nodemailer';
import { config as dotEnvConfig } from "dotenv";


dotEnvConfig();
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME ?? "",
        pass: process.env.MAIL_PASSWORD ?? "",
    }
});


export const sendMail = async (to: string, subject: string, text: string) => {

    const mailOptions = {
        from: process.env.MAIL_USERNAME ?? "",
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info)=> {
        if (error) {
            console.log(error);
        } else {
            console.log('Email eeeeee: ' + info.response);
        }
    });
} 