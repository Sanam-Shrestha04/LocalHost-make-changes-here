import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "/src/utils/axiosInstance.js";
import { UserContext } from "../../context/userContext";
import { validateEmail } from "../../utils/validation";
import AuthLayout from "../../components/layouts/AuthLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(message);

      // If account is unverified, redirect to Resend Verification page
      if (
        message.toLowerCase().includes("verify your email") ||
        message.toLowerCase().includes("unverified")
      ) {
        navigate(`/auth/resend-verification?email=${encodeURIComponent(email)}`);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%]">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[7px] mb-5 capitalize">
          Please enter your details to Log In.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            type="text"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="Email"
          />

          <Input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
          />

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-xs mt-2">{successMessage}</p>
          )}

          <div className="flex justify-end mb-3">
            <Link
              to="/forgot-password"
              className="text-sm text-primary underline hover:opacity-80"
            >
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
