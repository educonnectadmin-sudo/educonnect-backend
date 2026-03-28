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

    const msg = {
      to: to,
      from: process.env.EMAIL_USER,
      subject: "Leave Application Status",

      html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        padding: 40px;
        text-align: center;
      ">

        <div style="
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          border-radius: 12px;
          padding: 30px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        ">

          <!-- VERY LIGHT BACKGROUND LOGO -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.03; /* 🔥 MORE LIGHT */
          ">
            <img src="https://res.cloudinary.com/dcurr0wjz/image/upload/v1774714989/Gemini_Generated_Image_oig6yzoig6yzoig6_h73pna.png" width="350"/>
          </div>

          <!-- CONTENT -->
          <div style="position: relative; z-index: 2; text-align: left;">

            <h2 style="color:#6a0dad;">Hi ${name},</h2>

            <p>
              The HOD has formally reviewed your leave application.
            </p>

            <p style="margin-top:20px;">
              <b>Status:</b> 
              <span style="color:${status === "APPROVED" ? "green" : "red"};">
                ${status}
              </span>
            </p>

            <p>
              <b>Duration:</b> ${fromDate} → ${toDate}
            </p>

            <hr style="margin:20px 0;" />

            <p style="font-style: italic; color: #555;">
              "Your leave application has been ${status.toLowerCase()} by the HOD."
            </p>

            <p style="margin-top:30px;">
              Regards,<br/>
              <b>EduConnect Team</b>
            </p>

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

// ✅ Render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});