const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("EduConnect Backend Running ✅");
});


// =====================================
// ✅ SINGLE EMAIL API (FINAL)
// =====================================
app.post("/send-email", async (req, res) => {
  try {
    const {
      type,        // "leave" OR "reply"
      to,
      name,
      status,
      fromDate,
      toDate,
      userMessage,
      adminReply
    } = req.body;

    // ✅ validations
    if (!to) {
      return res.status(400).send("Email required");
    }

    if (!type) {
      return res.status(400).send("Type is required (leave or reply)");
    }

    let htmlContent = "";

    // ===============================
    // ✅ LEAVE EMAIL
    // ===============================
    if (type === "leave") {

      htmlContent = `
      <p>Hi <b>${name}</b>,</p>

      <p>Your leave application has been reviewed.</p>

      <div style="text-align:center;margin:20px 0;">
        <span style="
          padding:10px 25px;
          border-radius:20px;
          color:white;
          font-weight:bold;
          background:${status === "APPROVED" ? "#28a745" : "#dc3545"};
        ">
          ${status}
        </span>
      </div>

      <div style="background:#f1f3f5;padding:10px;border-radius:6px;">
        <p><b>From:</b> ${fromDate}</p>
        <p><b>To:</b> ${toDate}</p>
      </div>

      <p style="color:#666;">This is an automated notification.</p>

      <p>Regards,<br/><b>EduConnect Team</b></p>
      `;
    }

    // ===============================
    // ✅ ADMIN REPLY EMAIL
    // ===============================
    else if (type === "reply") {

      htmlContent = `
      <p>Hi <b>${name}</b>,</p>

      <p>Admin has replied to your message.</p>

      <div style="
        background:#f1f3f5;
        padding:12px;
        border-left:4px solid #4a6cf7;
        margin:15px 0;
      ">
        <b>Original Message:</b><br/>
        ${userMessage}
      </div>

      <div style="
        background:#e6f4ea;
        padding:12px;
        border-left:4px solid #28a745;
        margin:15px 0;
      ">
        <b>Admin Reply:</b><br/>
        ${adminReply}
      </div>

      <p>Regards,<br/><b>EduConnect Team</b></p>
      `;
    }

    // ✅ fallback (prevents empty email)
    if (!htmlContent) {
      htmlContent = `<p>Invalid email type provided.</p>`;
    }

    // ===============================
    // ✅ COMMON EMAIL UI
    // ===============================
    const finalHTML = `
    <div style="background:#f4f6f9;padding:30px;font-family:Arial;">

      <div style="
        max-width:600px;
        margin:auto;
        background:white;
        border-radius:12px;
        box-shadow:0 5px 20px rgba(0,0,0,0.1);
        overflow:hidden;
      ">

        <!-- HEADER -->
        <div style="text-align:center;padding:20px;border-bottom:1px solid #eee;">
          <img src="https://res.cloudinary.com/dcurr0wjz/image/upload/v1774718035/Gemini_Generated_Image_oig6yzoig6yzoig6_qkdwvg.png" width="60"/>
          <h2 style="color:#4a6cf7;margin-top:10px;">EduConnect</h2>
        </div>

        <!-- BODY -->
        <div style="padding:25px;">
          ${htmlContent}
        </div>

      </div>

    </div>
    `;

    // ===============================
    // ✅ SEND EMAIL
    // ===============================
    await sgMail.send({
      to,
      from: process.env.EMAIL_USER, // MUST be verified in SendGrid
      subject: type === "leave"
        ? `Leave ${status}`
        : "Admin Reply from EduConnect",
      html: finalHTML
    });

    res.send("Email sent successfully ✅");

  } catch (err) {
    console.error("❌ ERROR:", err.response?.body || err.message);
    res.status(500).send("Email failed ❌");
  }
});


// =====================================
// ✅ SERVER
// =====================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});