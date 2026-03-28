const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Test route
app.get("/", (req, res) => {
  res.send("EduConnect Backend is Running ✅");
});

// Send Email API
app.post("/send-email", async (req, res) => {
  const { to, name, status, fromDate, toDate } = req.body;

  const msg = {
    to: to,
    from: "educonnect.admin@gmail.com", // must be verified
    subject: "Leave Application Status",
    text: `Hello ${name},

Your leave request has been ${status}.

From: ${fromDate}
To: ${toDate}

Thank you.`,
  };

  try {
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