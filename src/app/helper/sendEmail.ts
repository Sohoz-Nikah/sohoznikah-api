import config from '../config';
import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.send_email.email,
      pass: config.send_email.app_pass,
    },
  });

  await transporter.sendMail({
    from: config.send_email.email, // sender address
    to, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });
}
