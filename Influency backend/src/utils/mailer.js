const axios = require("axios");

const sendOtpMail = async (email, otp) => {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { email: "muditc57@gmail.com", name: "Influency" },
      to: [{ email }],
      subject: "Influency - Your OTP Code",
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
          <h2 style="color:#7a1f3d;">Influency</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing:6px;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};

module.exports = { sendOtpMail };