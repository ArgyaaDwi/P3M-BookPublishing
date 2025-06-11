import nodemailer from "nodemailer";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
};
export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  await transporter.sendMail({
    from: `"P3M-Book Publishing" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
