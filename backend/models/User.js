const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: "" },
    role: { type: String, enum: ["admin", "user"], default: "user" },

    // Email verification fields
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },

    // Link-based verification fields
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },

    // OTP attempt tracking
    otpResendCount: { type: Number, default: 0 },
    otpFailedCount: { type: Number, default: 0 },
    otpBlockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
