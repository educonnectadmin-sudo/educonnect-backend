const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SAFE CHECK (prevents crash)
const API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL = process.env.EMAIL_USER;

if (!API_KEY || !EMAIL) {
  console.error("❌ Missing ENV variables");
} else {
  sgMail.setApiKey(API_KEY);
}

// ✅ Test route
app.get("/", (req, res) => {
  res.send("EduConnect Backend is Running ✅");
});

// ✅ Send Email API
app.post("/send-email", async (req, res) => {
  try {
    const { to, name, status, fromDate, toDate } = req.body;

    if (!to) {
      return res.status(400).send("Recipient email is required");
    }

    if (!API_KEY || !EMAIL) {
      return res.status(500).send("Server config error ❌");
    }

    const msg = {
      to: to,
      from: EMAIL,
      subject: "Leave Application Status",

      html: `
      <div style="font-family: Arial; padding:40px;">
        <div style="position:relative; max-width:600px; margin:auto; padding:30px;">

          <!-- LOGO -->
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); opacity:0.12;">
            <img src="https://res.cloudinary.com/dcurr0wjz/image/upload/v1774714989/Gemini_Generated_Image_oig6yzoig6yzoig6_h73pna.png" width="350"/>
          </div>

          <div style="position:relative; z-index:2;">
            <h2>Hi ${name},</h2>
            <p>Status: <b>${status}</b></p>
            <p>${fromDate} → ${toDate}</p>
          </div>

        </div>
      </div>
      `
    };

    await sgMail.send(msg);

    res.send("Email sent successfully ✅");

  } catch (error) {
    console.error("❌ ERROR:", error.response?.body || error.message);
    res.status(500).send("Email failed ❌");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});