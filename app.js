const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const { User } = require("./models");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/submittedForms", async (req, res) => {
  const submittedForms = await User.getUsers();
  return res.json(submittedForms);
});

app.post("/user", async (req, res) => {
  console.log("creating a user", res.body);
  try {
    const phoneRegex = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/; // Matches XXX-XXX-XXXX or XXX XXX XXXX
    if (!phoneRegex.test(req.body.phoneNumber)) {
      return res.status(422).json({ error: "Invalid phone number format" });
    }
    const user = await User.addUser({
      name: req.body.name,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    });

    const transporter = nodemailer.createTransport({
      // Set up your email configuration here (e.g., SMTP server, credentials)
      host: "smtp-mail.outlook.com", // hostname
      secureConnection: true, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: "myformresponse@hotmail.com",
        pass: "Karan@03",
      },
    });

    const mailOptions = {
      from: "myformresponse@hotmail.com",
      to: user.email,
      subject: "Welcome to MyForms!",
      text: "Congratulations! Your account has been created successfully.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res.json(user);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

module.exports = app;
