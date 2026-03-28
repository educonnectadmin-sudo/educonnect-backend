const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root route (for browser test)
app.get("/", (req, res) => {
  res.send("EduConnect Backend is Running ✅");
});

// ✅ Environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ✅ Check if env variables exist
if (!EMAIL_USER || !EMAIL_PASS) {
  console.log("❌ Missing EMAIL_USER or EMAIL_PASS");
}

// ✅ Gmail transporter (IPv4 FIX)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // 👈 IMPORTANT (fixes Render issue)
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// ✅ Email API
app.post("/send-email", async (req, res) => {
  try {
    const { to, name, status, fromDate, toDate } = req.body;

    // basic validation
    if (!to) {
      return res.status(400).send("Recipient email is required");
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
    console.error("❌ Email Error:", error);
    res.status(500).send("Failed to send email");
  }
});

// ✅ Dynamic port (Render requirement)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});