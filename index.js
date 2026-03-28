const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

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
      from: process.env.EMAIL_USER,
      subject: "Leave Application Status",

      html: `
      <div style="
        background-color:#f4f6f8;
        padding:20px;
        font-family:Arial, sans-serif;
      ">
        
        <div style="
          max-width:600px;
          margin:auto;
          background:white;
          border-radius:10px;
          padding:30px;
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
          background-image: url('https://res.cloudinary.com/dcurr0wjz/image/upload/v1774714989/Gemini_Generated_Image_oig6yzoig6yzoig6_h73pna.png'); /* 🔥 replace with your logo link */
          background-repeat: no-repeat;
          background-position: center;
          background-size: 200px;
        ">
          
          <!-- overlay for light effect -->
          <div style="background: rgba(255,255,255,0.9); padding:20px; border-radius:10px;">
            
            <div style="text-align:center; margin-bottom:20px;">
              <h2 style="color:#4a6cf7; margin:0;">EduConnect</h2>
            </div>

            <p>Hi <b>${name}</b>,</p>

            <p>
              The HOD has formally deliberated upon your petition for 
              <b>Sick Leave</b> and issued the following decree:
            </p>

            <p>
              <b>Status:</b> 
              <span style="color:${statusColor}; font-weight:bold;">
                ${status}
              </span>
            </p>

            <p>
              <b>Temporal Range:</b> ${fromDate} to ${toDate}
            </p>

            <p>
              <b>Official Commentary:</b><br/>
              "Your leave application has been ${status.toLowerCase()}."
            </p>

            <p style="font-style:italic; color:#666;">
              This is an automated message from EduConnect.
            </p>

            <hr style="margin:20px 0;"/>

            <p>
              Regards,<br/>
              <b>EduConnect Team</b>
            </p>

          </div>
        </div>

      </div>
      `,
    };

    await sgMail.send(msg);

    res.send("Email sent successfully ✅");

  } catch (error) {
    console.error(error.response?.body || error.message);
    res.status(500).send("Email failed ❌");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});