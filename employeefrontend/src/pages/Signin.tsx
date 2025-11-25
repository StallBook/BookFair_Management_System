import React, { useState } from "react";
import bg from "../assets/bg1.png";
import logo from "../assets/lg.png";
import { Typography, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const { Text } = Typography;

const Signin: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", values);
      // use backend message if provided
      const successMsg = data?.msg || "Signed in successfully";
      if (data?.token) {
        localStorage.setItem("sb_token", data.token);
      }
      message.success(successMsg);
      navigate("/dashboard");
    } catch (err: any) {
      // map server field errors (common shape: { errors: [{ param, msg }, ...] })
      const errors: Array<{ param?: string; msg?: string }> = err?.response?.data?.errors || [];
      if (errors.length) {
        const fields = errors.map(e => ({
          name: e.param || "unknown",
          errors: [e.msg || "Invalid value"],
        }));
        form.setFields(fields as any);
        message.error(err?.response?.data?.msg || "Please fix the highlighted fields");
      } else {
        const apiMsg = err?.response?.data?.msg || err?.response?.data?.error || "Login failed";
        message.error(apiMsg);
      }
    } finally {
      setLoading(false);
    }
  };

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
      <div className="absolute inset-0 bg-black/40 md:bg-black/30" />

      <img
        src={logo}
        alt="Stallbook"
        className="absolute z-10 top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 h-10 sm:h-12 md:h-14 lg:h-16 pointer-events-none select-none"
      />

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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">Welcome Back!</h1>
        <p className="text-xs sm:text-sm text-black/70 mb-6 text-md font-medium">Sign in to continue to StallBook</p>

        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ email: "", password: "" }}>
          <Form.Item
            label={<span className="text-gray-800">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-800">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="w-full bg-black"
              style={{ fontWeight: 600 }}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>

        <Text className="block mt-4 sm:mt-5 text-center font-md md:text-base text-gray-700">
          Don't have an account?{" "}
          <button type="button" className="text-red-700 hover:underline font-medium" onClick={() => navigate("/")}>
            Sign Up
          </button>
        </Text>
      </div>
    </div>
  );
};

export default Signin;
