import nodemailer from "nodemailer";
import Imap from "imap";

import logger from '../logger.js'

import dotenv from 'dotenv'
dotenv.config()

// Email configuration
const senderEmail = process.env.EMAIL_USER;
const senderPassword = process.env.EMAIL_PASS;

// SMTP (sending) server details
const smtpServer = "smtp.titan.email";
const smtpPort = 587;

// IMAP (receiving) server details
const imapServer = "imap.titan.email";
const imapPort = 993;

const transporter = nodemailer.createTransport({
  host: smtpServer,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendDownloadLinkEmail = async (email, link) => {
  const htmlMessage = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f8f8f8;
      margin: 0;
      padding: 0;
      color: #555555;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .logo {
      max-width: 150px;
      height: auto;
      margin-bottom: 20px;
    }
    h1 {
      color: #333333;
      font-size: 24px;
      margin-bottom: 15px;
    }
    p {
      font-size: 16px;
      margin-bottom: 25px;
    }
    .button {
    padding: 10px 20px;
    font-size: 16px;
    text-decoration: none;
    background-image: linear-gradient(to right, purple, pink); /* Gradient color */
    color: #ffffff;
    border-radius: 4px;
    transition: background-color 0.3s;
    border: none; /* Optional: removes border */
  }
  .button:hover {
    background-image: linear-gradient(to right, darkpurple, darkpink); /* Darker gradient on hover */
  }
    .footer {
      font-size: 12px;
      text-align: center;
      margin-top: 30px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <img class="logo" src="https://media.discordapp.net/attachments/715915920601776199/1188917583328575568/logoonly.png?ex=659c44c8&is=6589cfc8&hm=591b4b63c4b78878e3d291cabe5e2f9d2f6a94567772024d97e0b9332f16dce1&=&format=webp&quality=lossless&width=845&height=562" alt="VoxaLinkPro Logo">
    <h1>Transcription Download Link</h1>
    <p>Click the button below to download/view your transcription:</p>
    <a class="button" href="${link}" target="_blank">Download Transcription</a>
    <div class="footer">
      <p>All rights reserved © 2023 VoxaLinkPro</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const mailOptions = {
      from: {
        name: "VoxaLink Pro",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Transcription Download Link",
      html: htmlMessage,
      text: `Download your transcription here: ${link}` ,
    };
    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${email}`);

    const imap = new Imap({
      user: senderEmail,
      password: senderPassword,
      host: imapServer,
      port: imapPort,
      tls: true,
    });

    imap.once("ready", () => {
      imap.openBox("Sent", true, (err) => {
        if (err) {
          logger.error('Error opening "Sent" folder:', err);
          imap.end();
          return;
        }

        // Create the email message as MIMEText
        const emailMessage = `From: ${senderEmail}\r\nTo: ${email}\r\nSubject: Transcription Download Link\r\nContent-Type: text/html\r\n\r\n${htmlMessage}`;

        // Append the sent email to the "Sent" folder
        imap.append(emailMessage, { mailbox: "Sent" }, (appendErr) => {
          if (appendErr) {
            logger.error('Error appending email to "Sent" folder:', appendErr);
          } else {
            logger.info('Email appended to "Sent" folder.');
          }
          imap.end();
        });
      });
    });
    imap.once("error", (imapErr) => {
      logger.error("IMAP Error:", imapErr);
    });

    imap.connect();
    return true;
  } 
  
  catch (error) {
    logger.error(`Error sending email: ${error}`);
    return false;
  }
};
