import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config(); // this has to be called early

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (mailOptions) => {
  return await transporter.sendMail(mailOptions);
};