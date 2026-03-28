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

      <!-- BACKGROUND LOGO (VISIBLE NOW) -->
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.12; /* 🔥 THIS IS THE FIX */
      ">
        <img src="https://res.cloudinary.com/dcurr0wjz/image/upload/v1774714989/Gemini_Generated_Image_oig6yzoig6yzoig6_h73pna.png" width="350"/>
      </div>

      <!-- CONTENT -->
      <div style="position: relative; z-index: 2; text-align: left;">

        <h2 style="color:#6a0dad;">Hi ${name},</h2>

        <p>The HOD has formally reviewed your leave application.</p>

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