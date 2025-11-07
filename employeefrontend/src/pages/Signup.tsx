import React from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;


const Signup = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center">
            {/* Transparent Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Signup Card */}
            <div className="justify-center items-center bg-white/40 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-11/12 max-w-md text-center">

                
            </div>
        </div>
    );
};

export default Signup;
