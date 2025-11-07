import React, { useState } from "react";
import bg from "../assets/bg1.png";
import logo from "../assets/lg.png";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { userSignUpService } from "../services/User";
import { toast } from "react-toastify";

const { Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const data = {
        name: values.username,
        email: values.email,
        password: values.password,
      };
      const response = await userSignUpService(data);

      if (response.message === "success") {
        toast.success("Welcome! You’ve successfully registered.");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        toast.error(response.error || "Registration failed. Try again!");
      }
      console.log("Signup response:", response);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValues.username || !formValues.email || !formValues.password) {
      toast.warn("Please fill out all fields.");
      return;
    }
    onFinish(formValues);
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
          Create Your Account
        </h1>

        {/* Input Fields */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="username"
            value={formValues.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="email"
            value={formValues.email}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="password"
            value={formValues.password}
            onChange={handleChange}
          />

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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="w-16 h-px bg-gray-400"></span>
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <span className="w-16 h-px bg-gray-400"></span>
        </div>

        {/* Google Signup */}
        <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-3 px-4 w-full transition-all mb-4">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>
        <Text className="mt-3 text-center text-sm md:text-base text-gray-700">
          Already have an account?{" "}
          <span
            className="text-blue-700 cursor-pointer hover:underline"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </Text>
      </div>
    </div>
  );
};

export default Signup;
