import React from "react";
import bg from "../assets/bg1.png";
import logo from "../assets/lg.png";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;


const Signin = () => {
    const navigate = useNavigate();

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
                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Signup Button */}
                    <button
                        type="submit"
                        className="bg-blue-600 w-full hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all mt-2"
                    >
                        Login                    </button>
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
