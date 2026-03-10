const nodemailer = require("nodemailer");

// ✅ Create Brevo email transporter
const createTransporter = () => {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_PORT ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    console.error("❌ Email ENV variables missing");
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,          // smtp-relay.brevo.com
    port: Number(process.env.EMAIL_PORT),  // 587
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,        // a1db8f001@smtp-brevo.com
      pass: process.env.EMAIL_PASS,        // Brevo SMTP password
    },
  });
};

/**
 * ✅ Send OTP email
 */
const sendOTPEmail = async (email, otp, fullName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Email Verification - Eduoding",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Hello ${fullName || "User"} 👋</h2>
        <p>Your OTP for Eduoding registration is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr />
        <p style="font-size: 12px;">© ${new Date().getFullYear()} Eduoding</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error("Failed to send OTP email");
  }
};

/**
 * ✅ Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"Eduoding" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset - Eduoding",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
};
