import config from '../config';
import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: parseInt(config.email.port as string, 10),
    secure: config.email.secure === 'true',
    auth: {
      user: config.email.from,
      pass: config.email.password,
    },
  });

  await transporter.sendMail({
    from: config.email.from, // sender address
    to, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });
}
