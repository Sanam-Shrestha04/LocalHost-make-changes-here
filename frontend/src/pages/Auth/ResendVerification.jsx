import React, { useState, useEffect } from "react";
import Input from "../../components/Inputs/Input";
import AuthLayout from "../../components/layouts/AuthLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { validateEmail } from "../../utils/validation";

const ResendVerification = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromQuery = urlParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [blockedTime, setBlockedTime] = useState(0); // 5-min lock
  const [cooldown, setCooldown] = useState(0); // 30s resend cooldown

  // --- 🕒 Check for saved block or cooldown on page load ---
  useEffect(() => {
    const storedBlockedUntil = localStorage.getItem("resendBlockedUntil");
    const storedCooldownUntil = localStorage.getItem("resendCooldownUntil");

    if (storedBlockedUntil) {
      const remaining = Math.floor((new Date(storedBlockedUntil) - new Date()) / 1000);
      if (remaining > 0) setBlockedTime(remaining);
      else localStorage.removeItem("resendBlockedUntil");
    }

    if (storedCooldownUntil) {
      const remaining = Math.floor((new Date(storedCooldownUntil) - new Date()) / 1000);
      if (remaining > 0) setCooldown(remaining);
      else localStorage.removeItem("resendCooldownUntil");
    }
  }, []);

  // --- ⏳ Countdown timers ---
  useEffect(() => {
    let timer;
    if (blockedTime > 0) {
      timer = setInterval(() => {
        setBlockedTime((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("resendBlockedUntil");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [blockedTime]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("resendCooldownUntil");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // --- 📤 Handle resend verification ---
  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (blockedTime > 0) return; // prevent if locked
    if (cooldown > 0) return; // prevent during cooldown

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.RESEND_VERIFICATION_OLD_USERS, { email });
      setMessage(res.data.message || "Verification email sent! Please check your inbox.");

      // Start 30s cooldown
      const cooldownEnd = new Date(Date.now() + 30 * 1000);
      localStorage.setItem("resendCooldownUntil", cooldownEnd.toISOString());
      setCooldown(30);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 429 && err.response?.data?.blockedUntil) {
        const blockedUntil = new Date(err.response.data.blockedUntil);
        localStorage.setItem("resendBlockedUntil", blockedUntil.toISOString());
        const remaining = Math.floor((blockedUntil - new Date()) / 1000);
        setBlockedTime(remaining > 0 ? remaining : 0);
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || "Failed to send verification email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toString().padStart(2, "0");
    return m > 0 ? `${m}:${s}` : `${s}s`;
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] relative">
        <h3 className="text-xl font-semibold text-black">Resend Verification</h3>
        <p className="text-xs text-slate-700 mt-[7px] mb-5 capitalize">
          Enter your email and we’ll send you a verification link.
        </p>

        <form onSubmit={handleResendVerification} className="relative">
          <Input
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="Email"
          />

          {/* 🕒 Timer near input */}
          {blockedTime > 0 && (
            <span className="absolute top-10 right-3 text-blue-500 text-xs font-medium">
              Wait {formatTime(blockedTime)}
            </span>
          )}
          {cooldown > 0 && blockedTime === 0 && (
            <span className="absolute top-10 right-3 text-blue-400 text-xs font-medium">
              Resend in {formatTime(cooldown)}
            </span>
          )}

          {/* 🪧 Messages */}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {message && <p className="text-green-500 text-xs mt-2">{message}</p>}

          <button
            type="submit"
            className={`btn-primary mt-3 w-full ${
              blockedTime > 0 ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading || blockedTime > 0 || cooldown > 0}
          >
            {loading
              ? "Sending..."
              : blockedTime > 0
              ? "Temporarily Locked"
              : "Send Verification Link"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResendVerification;
