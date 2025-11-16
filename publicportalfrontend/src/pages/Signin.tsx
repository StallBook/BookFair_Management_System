import React, { useState } from "react";
import bg from "../assets/bg1.png";
import logo from "../assets/lg.png";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { userSignInService } from "../services/User";
import { toast } from "react-toastify";
import { renderError } from "../helper/ErrorHelper";
import { validateSimpleField } from "../helper/ValidationHelper";

const { Text } = Typography;

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const API_URL = process.env.REACT_APP_API_URL;

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const data = {
        email: values.email,
        password: values.password,
      };
      const response = await userSignInService(data);
      console.log("Signin Response:", response);
      if (response.message === "success") {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        console.log("response.user:", response.user);
        if (response.user) {
          localStorage.setItem("userID", response.user.userID);
        }
        toast.success("Welcome back! You’ve successfully signed in.");
        setTimeout(() => navigate("/add-genres"), 2000);
      } else {
        toast.error(response.error || "Signin failed. Try again!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: any = {};
    Object.entries(formValues).forEach(([key, value]) => {
      newErrors[key] = validateSimpleField(key, value);
    });
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) return;

    onFinish(formValues);
  };

  const googleAuth = () => {
    console.log("API_URL:", API_URL);
    window.open(`${API_URL}/auth/auth/google`, "_self");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Transparent Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Signup Card */}
      <div className="justify-center items-center bg-white/40 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-11/12 max-w-md text-center">
        {/* Logo */}
        <img
          className="w-32 h-16 object-contain mx-auto mb-2 cursor-pointer"
          onClick={() => navigate("/")}
          src={logo}
          alt="Logo"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">
          Welcome Back!
        </h1>

        {/* Input Fields */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="text-left">
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formValues.email}
              className={`p-3 rounded-lg border ${
                errors.email
                  ? "border-red-400 focus:ring-red-500"
                  : "border-blue-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 w-full`}
              onChange={(e) => {
                const { name, value } = e.target;
                setFormValues({ ...formValues, [name]: value });
                setErrors({
                  ...errors,
                  [name]: validateSimpleField(name, value),
                });
              }}
            />
            {renderError(errors.email)}
          </div>
          <div className="text-left">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formValues.password}
              onChange={(e) => {
                const { name, value } = e.target;
                setFormValues({ ...formValues, [name]: value });
                setErrors({
                  ...errors,
                  [name]: validateSimpleField(name, value),
                });
              }}
              className={`p-3 rounded-lg border ${
                errors.password
                  ? "border-red-400 focus:ring-red-500"
                  : "border-blue-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 w-full`}
            />
            {renderError(errors.password)}
          </div>
          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } w-full text-white font-semibold py-3 rounded-lg transition-all mt-2`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="w-16 h-px bg-gray-400"></span>
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <span className="w-16 h-px bg-gray-400"></span>
        </div>

        {/* Google Signup */}
        <button
          type="button"
          onClick={googleAuth}
          className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 w-full transition-all mb-4"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
        <Text className="mt-3 text-center text-sm md:text-base text-gray-700">
          Don't have an account?{" "}
          <span
            className="text-blue-700 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </Text>
      </div>
    </div>
  );
};

export default Signin;
