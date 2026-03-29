const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SendGrid API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("EduConnect Backend is Running ✅");
});


// =====================================
// ✅ COMMON EMAIL TEMPLATE FUNCTION
// =====================================
function emailLayout(content) {
  return `
  <div style="background:#f4f6f9;padding:30px;font-family:'Segoe UI',Arial;">
    
    <div style="
      max-width:650px;
      margin:auto;
      background:white;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 8px 25px rgba(0,0,0,0.1);
    ">

      <!-- HEADER WITH LOGO -->
      <div style="text-align:center;padding:25px;border-bottom:1px solid #eee;">
        <img src="https://res.cloudinary.com/dcurr0wjz/image/upload/v1774718035/Gemini_Generated_Image_oig6yzoig6yzoig6_qkdwvg.png" width="80"/>
        <h2 style="margin:10px 0 0;color:#4a6cf7;">EduConnect</h2>
      </div>

      <!-- BODY -->
      <div style="padding:30px;">
        ${content}
      </div>

      <!-- FOOTER -->
      <div style="text-align:center;padding:15px;background:#f9fafc;font-size:12px;color:#777;">
        © EduConnect • Smart Academic Management
      </div>

    </div>

  </div>
  `;
}


// =====================================
// ✅ 1. LEAVE APPLICATION EMAIL
// =====================================
app.post("/send-email", async (req, res) => {
  try {
    const { to, name, status, fromDate, toDate } = req.body;

    if (!to) return res.status(400).send("Recipient email is required");

    const statusColor = status === "APPROVED" ? "#28a745" : "#dc3545";

    const content = `
      <p>Hi <b>${name}</b>,</p>

      <p>Your leave application has been reviewed.</p>

      <!-- STATUS BUTTON -->
      <div style="text-align:center;margin:25px 0;">
        <span style="
          padding:12px 30px;
          border-radius:25px;
          font-weight:bold;
          color:white;
          background:${statusColor};
        ">
          ${status}
        </span>
      </div>

      <!-- DETAILS -->
      <div style="background:#f1f3f5;padding:15px;border-radius:8px;">
        <p><b>From:</b> ${fromDate}</p>
        <p><b>To:</b> ${toDate}</p>
      </div>

      <p style="margin-top:20px;color:#666;">
        This is an automated notification.
      </p>

      <p>Regards,<br/><b>EduConnect Team</b></p>
    `;

    await sgMail.send({
      to,
      from: process.env.EMAIL_USER,
      subject: "Leave Application Status",
      html: emailLayout(content),
    });

    res.send("Leave email sent ✅");

  } catch (err) {
    console.error(err.response?.body || err.message);
    res.status(500).send("Email failed ❌");
  }
});


// =====================================
// ✅ 2. ADMIN REPLY EMAIL
// =====================================
app.post("/admin-reply", async (req, res) => {
  try {
    const { userEmail, userMessage, adminReply, name } = req.body;

    if (!userEmail) return res.status(400).send("User email required");

    const content = `
      <p>Hi <b>${name}</b>,</p>

      <p>Admin has responded to your query.</p>

      <!-- USER MESSAGE -->
      <div style="
        background:#f1f3f5;
        padding:15px;
        border-left:4px solid #4a6cf7;
        border-radius:6px;
        margin:15px 0;
      ">
        <b>Your Message:</b><br/>
        ${userMessage}
      </div>

      <!-- ADMIN REPLY -->
      <div style="
        background:#e6f4ea;
        padding:15px;
        border-left:4px solid #28a745;
        border-radius:6px;
        margin:15px 0;
      ">
        <b>Admin Reply:</b><br/>
        ${adminReply}
      </div>

      <p style="color:#666;">
        Feel free to reach out again if needed.
      </p>

      <p>Regards,<br/><b>EduConnect Team</b></p>
    `;

    await sgMail.send({
      to: userEmail,
      from: process.env.EMAIL_USER,
      subject: "EduConnect - Admin Reply",
      html: emailLayout(content),
    });

    res.send("Reply sent ✅");

  } catch (err) {
    console.error(err.response?.body || err.message);
    res.status(500).send("Reply failed ❌");
  }
});


// =====================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});