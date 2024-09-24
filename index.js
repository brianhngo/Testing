// Our  Node.js server using framework Express

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Creating Connection between Nodemailer and our thirdParty API.
const transport = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRIDAPI,
    },
  })
);

// Format
const sendEmail = async (email) => {
  try {
    await transport.sendMail({
      to: `${email}`, // Can be changed to anyone
      from: 'brianhngo@gmail.com', // Has to be registered on SendGrid. => Verifies email
      subject: 'Someone responded to your posting!',
      html: `
   <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac tincidunt nisi. Fusce quis purus a ante posuere dignissim. Integer euismod, justo vitae vestibulum blandit, massa elit tincidunt odio, sed fermentum nulla justo a quam. Sed scelerisque semper purus, sit amet fermentum nisl. Suspendisse potenti. Quisque eu tortor in velit fermentum tempus ac vitae quam.</p>
  `,
    });
    console.log('Email sent successfully!');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// localhost:3000/sendEmail
app.put('/sendEmail', async (req, res) => {
  try {
    const { email, usersEmail } = req.body;

    const result = await sendEmail(email);

    if (result) {
      // email has been sent
      res.status(200).json(true);
    } else {
      // email failed
      throw error('Failed');
    }
  } catch (error) {
    console.error(error);
  }
});

// server connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
