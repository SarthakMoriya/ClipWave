const nodemailer = require("nodemailer");

// Configure the transporter
// For Gmail: Use your email and an "App Password" (NOT your regular password)
// Follow: https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendResetEmail = async (toEmail, resetCode) => {
  const mailOptions = {
    from: `"ClipWave Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset Code - ClipWave",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #F57C00;">ClipWave Password Reset</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your ClipWave account. Use the 6-digit code below to reset your password:</p>
        <div style="background: #FFF8E1; padding: 20px; border-radius: 10px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #F57C00; border: 2px solid #FFE0B2;">
          ${resetCode}
        </div>
        <p style="margin-top: 20px;">This code will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #999;">ClipWave - Seamless File Sharing</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    // If it fails, we still want to know for debugging
    throw error;
  }
};

module.exports = { sendResetEmail };
