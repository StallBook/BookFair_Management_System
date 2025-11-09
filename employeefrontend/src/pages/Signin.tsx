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
            <img
                    src={logo}
                    alt="Stallbook"
                    className="absolute left-1/2 -translate-x-1/2 z-0
                               top-4 sm:top-6 md:top-8
                               h-10 sm:h-12 md:h-14 lg:h-16 pointer-events-none select-none"
                  />

            <div className="relative z-10 bg-white/40 backdrop-blur-md shadow-2xl rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg text-center"/>
      
            
        </div>
    );
};

export default Signin;
