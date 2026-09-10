const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: '"Influency" <muditc57@gmail.com>',
    to: email,
    subject: "Influency - Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#7a1f3d;">Influency</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This code expires in 5 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpMail };