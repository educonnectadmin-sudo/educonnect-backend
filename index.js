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

// ✅ Environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ✅ Debug (to confirm env is loaded)
console.log("EMAIL_USER:", EMAIL_USER ? "Loaded" : "Missing");

// ✅ FINAL FIXED TRANSPORTER (IMPORTANT)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // 🔥 FORCE IPv4 (fixes ENETUNREACH error)
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// ✅ Email API
app.post("/send-email", async (req, res) => {
  try {
    const { to, name, status, fromDate, toDate } = req.body;

    if (!to || !name || !status) {
      return res.status(400).send("Missing required fields");
    }

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

    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully ✅");

  } catch (error) {
    console.error("MAIL ERROR:", error);
    res.status(500).send(error.toString());
  }
});

// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});