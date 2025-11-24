import React, { useMemo, useState } from "react";
import bg from "../assets/bg1.png";
import logo from "../assets/lg.png";
import { Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const { Text } = Typography;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email: string) => {
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email";
  return "";
};
const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return "";
};

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // server-side field errors
  const [serverEmailError, setServerEmailError] = useState<string>("");
  const [serverPasswordError, setServerPasswordError] = useState<string>("");

  const emailError = useMemo(() => validateEmail(email), [email]);
  const passwordError = useMemo(() => validatePassword(password), [password]);

  const anyError = Boolean(emailError || passwordError);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // clear server side errors before attempt
    setServerEmailError("");
    setServerPasswordError("");

    if (anyError) {
      message.warning("Please fix validation errors before submitting");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/login", { email, password });

      // If backend returns a msg, prefer it for the toast
      const successMsg = data?.msg || "Signed in successfully";
      // store token if present
      if (data?.token) {
        localStorage.setItem("sb_token", data.token);
      }
      message.success(successMsg);
      navigate("/dashboard");
    } catch (err: any) {
      const apiMsg = err?.response?.data?.msg || err?.response?.data?.error || null;

      // handle field-level errors if provided (common shape: { errors: [{ param, msg }, ...] })
      const fieldErrors: Array<{ param?: string; msg?: string }> = err?.response?.data?.errors || [];

      if (fieldErrors.length) {
        fieldErrors.forEach((fe) => {
          const param = fe.param?.toString?.().toLowerCase?.();
          const text = fe.msg || "";
          if (param === "email") setServerEmailError(text);
          if (param === "password") setServerPasswordError(text);
        });
        message.error(apiMsg || "Please check the highlighted fields");
      } else {
        message.error(apiMsg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        relative min-h-screen
        bg-cover bg-center
        flex items-center justify-center
        px-4 sm:px-6 md:px-8
      "
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 md:bg-black/30" />

      {/* Logo: centered on mobile */}
      <img
        src={logo}
        alt="Stallbook"
        className="
          absolute z-10
          top-4 sm:top-6 md:top-8
          left-1/2 -translate-x-1/2
          h-10 sm:h-12 md:h-14 lg:h-16
          pointer-events-none select-none
        "
      />

      {/* Card */}
      <div
        className="
          relative z-20
          w-full max-w-[22rem] sm:max-w-md md:max-w-lg
          bg-white/50 backdrop-blur-sm sm:backdrop-blur-md
          shadow-2xl rounded-xl sm:rounded-2xl
          p-5 sm:p-6 md:p-8
          text-center
        "
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">
          Welcome Back!
        </h1>
        <p className="text-xs sm:text-sm text-black/70 mb-6 text-md font-medium">
          Sign in to continue to StallBook
        </p>

        {/* Form */}
        <form className="flex flex-col gap-3 sm:gap-4 text-left" onSubmit={handleSubmit}>
          <label className="text-sm sm:text-base text-gray-800" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={`
              w-full p-3 sm:p-3.5
              rounded-lg border
              ${emailError || serverEmailError ? "border-red-500" : "border-black/30"}
              bg-white/80
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
            `}
          />
          {emailError && <Text type="danger" className="text-xs">{emailError}</Text>}
          {!emailError && serverEmailError && <Text type="danger" className="text-xs">{serverEmailError}</Text>}

          <label className="text-sm sm:text-base text-gray-800 mt-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            autoComplete="current-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`
              w-full p-3 sm:p-3.5
              rounded-lg border
              ${passwordError || serverPasswordError ? "border-red-500" : "border-black/30"}
              bg-white/80
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
            `}
          />
          {passwordError && <Text type="danger" className="text-xs">{passwordError}</Text>}
          {!passwordError && serverPasswordError && <Text type="danger" className="text-xs">{serverPasswordError}</Text>}

          <button
            type="submit"
            disabled={loading || anyError}
            className={`
              mt-3 sm:mt-4
              bg-black hover:bg-gray-800 active:scale-[0.99]
              text-white font-semibold
              py-3 sm:py-3.5
              rounded-lg transition-all
              w-full
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <Text className="block mt-4 sm:mt-5 text-center font-md md:text-base text-gray-700">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-red-700 hover:underline font-medium"
            onClick={() => navigate("/")}
          >
            Sign Up
          </button>
        </Text>
      </div>
    </div>
  );
};

export default Signin;
