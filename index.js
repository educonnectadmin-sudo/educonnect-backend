const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Check API key
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is missing!");
}

// ✅ Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    const statusColor = status === "APPROVED" ? "#28a745" : "#dc3545";

    const msg = {
      to: to,
      from: process.env.EMAIL_USER, // must be verified
      subject: "Leave Application Status",

      html: `
      <div style="background-color:#f4f6f8; padding:20px; font-family:Arial, sans-serif;">
        
        <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- 🔷 Logo -->
          <div style="text-align:center; margin-bottom:20px;">
            <h2 style="color:#4a6cf7; margin:0;">EduConnect</h2>
          </div>

          <p>Hi <b>${name}</b>,</p>

          <p>
            The HOD has formally deliberated upon your petition for 
            <b>Sick Leave</b> and issued the following decree:
          </p>

          <!-- ✅ Status -->
          <p>
            <b>Status:</b> 
            <span style="color:${statusColor}; font-weight:bold;">
              ${status}
            </span>
          </p>

          <!-- 📅 Dates -->
          <p>
            <b>Temporal Range:</b> ${fromDate} to ${toDate}
          </p>

          <!-- 📝 Comment -->
          <p>
            <b>Official Commentary:</b><br/>
            "Your leave application for Sick Leave has been ${status.toLowerCase()} by the HOD."
          </p>

          <!-- ✨ Quote -->
          <p style="font-style:italic; color:#666;">
            Be it known that the administrative scrolls have been stamped.
            May your journey be fruitful, or your resilience be legendary.
          </p>

          <hr style="margin:20px 0;"/>

          <!-- 📩 Footer -->
          <p>
            Regards,<br/>
            <b>EduConnect Team</b>
          </p>

        </div>

      </div>
      `,
    };

    await sgMail.send(msg);

    res.send("Email sent successfully ✅");

  } catch (error) {
    console.error("❌ FULL ERROR:", error.response?.body || error.message);
    res.status(500).send("Email failed ❌");
  }
});

// ✅ IMPORTANT for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});