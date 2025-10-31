const nodemailer = require("nodemailer");
const path = require("path");

const sendEmail = async ({ email, subject, message, html, otp, verificationLink }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: parseInt(process.env.SMTP_PORT, 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // --- 🪄 Verification-specific email layout ---
    let emailContent = "";
    if (otp && verificationLink) {
      emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #007BFF;">Verify Your Account</h2>
          <p>Hello 👋,</p>
          <p>We noticed your account is not yet verified. Please verify to continue using all features.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="font-size: 22px; font-weight: bold; color: #222; margin: 10px 0;">
            ${otp}
          </div>
          <p>This OTP will expire soon, so use it quickly!</p>
          <p>Or click the button below to verify directly:</p>
          <a href="${verificationLink}" 
            style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; 
                   border-radius: 6px; display: inline-block; margin-top: 10px;">
            Verify My Account
          </a>
          <p style="margin-top: 25px; color: #888;">If you didn’t request this, please ignore this email.</p>
          <img src="cid:taskforgeLogo" style="width:120px; height:auto; margin-top:20px;" alt="TaskForge Logo" />
        </div>
      `;
    } else {
      // --- 📨 Fallback for other general emails (like forgot password, etc.)
      emailContent = html
        ? `${html}<br/><img src="cid:taskforgeLogo" style="width:120px; height:auto; margin-top:20px;" />`
        : `<p>${message}</p><br/><img src="cid:taskforgeLogo" style="width:120px; height:auto; margin-top:20px;" />`;
    }

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject,
      html: emailContent,
      attachments: [
        {
          filename: "taskforge.png",
          path: path.join(__dirname, "../uploads/taskforge.png"),
          cid: "taskforgeLogo", // same as in <img src="cid:taskforgeLogo" />
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Verification email sent successfully to: ${email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;
