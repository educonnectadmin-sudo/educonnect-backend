const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "educonnect.admin@gmail.com",
    pass: "eqzwgixdnlkphgar"
  }
});

// API to send email
app.post("/send-email", async (req, res) => {
  const { to, name, status, fromDate, toDate } = req.body;

  const mailOptions = {
    from: "educonnect.admin@gmail.com",
    to: to,
    subject: "Leave Application Status",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your leave request is <b>${status}</b></p>
      <p>From: ${fromDate} To: ${toDate}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});