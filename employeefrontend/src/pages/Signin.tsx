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

           
            
        </div>
    );
};

export default Signin;
