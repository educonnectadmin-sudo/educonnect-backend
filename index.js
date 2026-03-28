const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("EduConnect Backend is Running ✅");
});

// ✅ Environment variables (DO NOT hardcode email/password)
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ✅ Gmail transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // 👈 FORCE IPv4 (IMPORTANT)
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// ✅ API to send email
app.post("/send-email", async (req, res) => {
  const { to, name, status, fromDate, toDate } = req.body;

  const mailOptions = {
    from: EMAIL_USER,
    to: to,
    subject: "Leave Application Status",
    text: `Hello ${name},

Your leave request has been ${status}.

From: ${fromDate}
To: ${toDate}

Thank you.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.toString());
  }
});

// ✅ IMPORTANT for Render (dynamic port)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});