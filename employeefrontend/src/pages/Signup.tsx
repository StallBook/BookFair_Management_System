import bg from "../assets/bg1.png";
import React, { useMemo, useState } from "react";
import { Typography, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/lg.png";
import axios from "axios";

const { Title, Text } = Typography;

// Vite style env (use REACT_APP_API_BASE for CRA)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
// at least 8 chars, 1 uppercase, 1 lowercase, 1 number

const validateName = (name: string) => {
  if (!name) return "Full name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return "";
};
const validateEmail = (email: string) => {
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email";
  return "";
};
const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  if (!passwordRegex.test(password))
    return "Password must be 8+ chars and include uppercase, lowercase and a number";
  return "";
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // server side field errors (optional)
  const [serverNameError, setServerNameError] = useState<string>("");
  const [serverEmailError, setServerEmailError] = useState<string>("");
  const [serverPasswordError, setServerPasswordError] = useState<string>("");

  const nameError = useMemo(() => validateName(name), [name]);
  const emailError = useMemo(() => validateEmail(email), [email]);
  const passwordError = useMemo(() => validatePassword(password), [password]);

  const anyError = Boolean(nameError || emailError || passwordError);

  async function handleSubmit() {
    // clear server errors on new attempt
    setServerNameError("");
    setServerEmailError("");
    setServerPasswordError("");

    if (anyError) {
      message.warning("Please fix validation errors before submitting");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/api/auth/register`,
        { name, email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Prefer API message if provided
      const successMsg = res?.data?.msg || "Signup successful! Please sign in.";
      message.success(successMsg);
      navigate("/signin");
    } catch (err: any) {
      // API message fallback
      const apiMsg =
        err?.response?.data?.msg || err?.response?.data?.error || null;

      // If backend provided field-level errors (common shape: { errors: [{ param, msg }, ...] })
      const fieldErrors: Array<{ param?: string; msg?: string }> =
        err?.response?.data?.errors || [];

      if (fieldErrors.length) {
        fieldErrors.forEach((fe) => {
          const param = fe.param?.toString?.().toLowerCase?.();
          const text = fe.msg || "";
          if (param === "name" || param === "fullname")
            setServerNameError(text);
          if (param === "email") setServerEmailError(text);
          if (param === "password") setServerPasswordError(text);
        });
        // show a short toast letting user check inline errors
        message.error(apiMsg || "Please fix the highlighted errors");
      } else {
        // generic API error
        message.error(apiMsg || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-0"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <img
        src={logo}
        alt="Stallbook"
        className="absolute left-1/2 -translate-x-1/2 z-0
                   top-4 sm:top-6 md:top-8
                   h-10 sm:h-12 md:h-14 lg:h-16 pointer-events-none select-none"
      />

      {/* Card */}
      <div className="relative z-10 bg-white/40 backdrop-blur-md shadow-2xl rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg text-center">
        <Title
          level={3}
          style={{
            color: "black",
            marginBottom: 4,
            fontWeight: 600,
            fontSize: "clamp(20px, 2.4vw, 28px)",
          }}
        >
          Create your account
        </Title>
        <Text
          style={{
            color: "rgba(16, 1, 1, 0.7)",
            fontWeight: 500,
            fontSize: "clamp(12px, 1.6vw, 16px)",
          }}
        >
          Join the StallBook employee portal
        </Text>

        <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4 text-left">
          <div>
            <Text style={{ color: "black" }}>Full Name</Text>
            <Input
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              status={nameError || serverNameError ? "error" : undefined}
            />
            {nameError && (
              <Text type="danger" className="text-xs">
                {nameError}
              </Text>
            )}
            {!nameError && serverNameError && (
              <Text type="danger" className="text-xs">
                {serverNameError}
              </Text>
            )}
          </div>

          <div>
            <Text style={{ color: "black" }}>Email</Text>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              status={emailError || serverEmailError ? "error" : undefined}
            />
            {emailError && (
              <Text type="danger" className="text-xs">
                {emailError}
              </Text>
            )}
            {!emailError && serverEmailError && (
              <Text type="danger" className="text-xs">
                {serverEmailError}
              </Text>
            )}
          </div>

          <div>
            <Text style={{ color: "black" }}>Password</Text>
            <Input.Password
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              status={
                passwordError || serverPasswordError ? "error" : undefined
              }
            />
            {passwordError && (
              <Text type="danger" className="text-xs">
                {passwordError}
              </Text>
            )}
            {!passwordError && serverPasswordError && (
              <Text type="danger" className="text-xs">
                {serverPasswordError}
              </Text>
            )}
            <Text className="block mt-1 text-xs text-black/60">
              Minimum 8 characters; include uppercase, lowercase and a number.
            </Text>
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={loading} // disable when needed
            className="w-full !bg-black !border-black hover:!bg-black hover:!border-black focus:!bg-black active:!bg-black"
            style={{ fontWeight: 600 }}
          >
            {loading ? "Signing up..." : "Sign up"} {/* show text always */}
          </Button>
        </div>

        <div className="mt-5 sm:mt-6 text-xs sm:text-sm">
          <Text style={{ color: "rgba(0, 0, 0, 0.7)" }}>
            Already have an account?{" "}
          </Text>
          <Button
            type="link"
            style={{
              color: "#e4202dff",
              padding: 0,
              fontWeight: 600,
              textDecoration: "underline",
            }}
            onClick={() => navigate("/signin")}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
