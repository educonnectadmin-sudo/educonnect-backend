const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SendGrid API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Test
app.get("/", (req, res) => {
  res.send("EduConnect Backend is Running ✅");
});


// =====================================
// ✅ 1. LEAVE APPLICATION (ALREADY)
// =====================================
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
      <div style="background-color:#f4f6f8;padding:20px;font-family:Arial;">
        <div style="
          max-width:600px;
          margin:auto;
          background:white;
          border-radius:10px;
          padding:30px;
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
          background-image: url('https://res.cloudinary.com/dcurr0wjz/image/upload/v1774718035/Gemini_Generated_Image_oig6yzoig6yzoig6_qkdwvg.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 200px;
        ">

        <div style="background: rgba(255,255,255,0.9); padding:20px; border-radius:10px;">

          <h2 style="color:#4a6cf7;text-align:center;">EduConnect</h2>

          <p>Hi <b>${name}</b>,</p>

          <p>Your leave request has been processed.</p>

          <p><b>Status:</b> 
            <span style="color:${statusColor};font-weight:bold;">
              ${status}
            </span>
          </p>

          <p><b>From:</b> ${fromDate}</p>
          <p><b>To:</b> ${toDate}</p>

          <hr/>

          <p>Regards,<br/><b>EduConnect Team</b></p>

        </div>
        </div>
      </div>
      `
    };

    await sgMail.send(msg);
    res.send("Leave email sent ✅");

  } catch (error) {
    console.error(error.response?.body || error.message);
    res.status(500).send("Email failed ❌");
  }
});


// =====================================
// ✅ 2. ADMIN REPLY (NEW FEATURE)
// =====================================
app.post("/admin-reply", async (req, res) => {
  try {
    const { userEmail, userMessage, adminReply, name } = req.body;

    if (!userEmail) {
      return res.status(400).send("User email required");
    }

    const msg = {
      to: userEmail,
      from: process.env.EMAIL_USER,
      subject: "EduConnect - Admin Reply",

      html: `
      <div style="background-color:#f4f6f8;padding:20px;font-family:Arial;">
        
        <div style="
          max-width:600px;
          margin:auto;
          background:white;
          border-radius:10px;
          padding:30px;
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
          background-image: url('https://res.cloudinary.com/dcurr0wjz/image/upload/v1774718035/Gemini_Generated_Image_oig6yzoig6yzoig6_qkdwvg.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 200px;
        ">

        <div style="background: rgba(255,255,255,0.9); padding:20px; border-radius:10px;">

          <h2 style="color:#4a6cf7;text-align:center;">EduConnect</h2>

          <p>Hi <b>${name}</b>,</p>

          <p>Admin has replied to your message.</p>

          <hr/>

          <p><b>Your message:</b></p>
          <p>${userMessage}</p>

          <p><b>Admin reply:</b></p>
          <p>${adminReply}</p>

          <hr/>

          <p>Regards,<br/><b>EduConnect Team</b></p>

        </div>
        </div>

      </div>
      `
    };

    await sgMail.send(msg);
    res.send("Reply sent ✅");

  } catch (error) {
    console.error(error.response?.body || error.message);
    res.status(500).send("Reply failed ❌");
  }
});
// test change

// =====================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});