import React from "react";
import bg from "../assets/bg1.png";
import logo from "../assets/lg.png";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function Signin() {
    const navigate = useNavigate();

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

            {/* Logo: centered on mobile, pinned left on md+ */}
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
                <p className="text-xs sm:text-sm text-black/70 mb-6 text-md font-medium ">
                    Sign in to continue to StallBook
                </p>

                {/* Form */}
                <form
                    className="flex flex-col gap-3 sm:gap-4 text-left"
                    onSubmit={(e) => {
                        e.preventDefault();
                        // handle submit here
                    }}
                >
                    <label className="text-sm sm:text-base text-gray-800" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        autoComplete="username"
                        type="text"
                        placeholder="you@example.com"
                        className="
              w-full p-3 sm:p-3.5
              rounded-lg border border-black/30
              bg-white/80
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
            "
                    />

                    <label className="text-sm sm:text-base text-gray-800 mt-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        type="password"
                        placeholder="••••••••"
                        className="
              w-full p-3 sm:p-3.5
              rounded-lg border border-black/30
              bg-white/80
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
            "
                    />

                    <button
                        type="submit"
                        className="
              mt-3 sm:mt-4
              bg-black hover:bg-gray-800 active:scale-[0.99]
              text-white font-semibold
              py-3 sm:py-3.5
              rounded-lg transition-all
              w-full
            "
                    >
                        Login
                    </button>
                </form>

                <Text className="block mt-4 sm:mt-5 text-center font-md md:text-base text-gray-700">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        className="text-red-700 hover:underline font-medium"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>
                </Text>
            </div>
        </div>
    );
}
