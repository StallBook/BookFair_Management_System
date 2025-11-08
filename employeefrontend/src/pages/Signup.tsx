import bg from '../assets/bg1.png';
import React from "react";
import { Typography, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import logo from '../assets/lg.png';

const { Title, Text } = Typography;

const Signup = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${bg})` }}>

            <img
        src={logo}
        alt="Stallbook"
        className="absolute top-12 left-1/2 -translate-x-1/2 z-0
                   h-12 md:h-14 lg:h-16 pointer-events-none select-none"
      />          

            {/* Card */}
            <div className="relative bg-white/40  backdrop-blur-md shadow-2xl rounded-2xl p-8 w-11/12 max-w-md text-center">
                <Title level={3} style={{ color: "black", marginBottom: 4, fontWeight: 600 }}>
                    Create your account
                </Title>
                <Text style={{ color: "rgba(16, 1, 1, 0.7)", fontWeight: 500 }}>
                    Join the  StallBook employee portal
                </Text>

                <div className="mt-6 space-y-4 text-left">
                    <div>
                        <Text style={{ color: "black" }}>Full Name</Text>
                        <Input placeholder="John Doe" />
                    </div>

                    <div>
                        <Text style={{ color: "black" }}>Email</Text>
                        <Input type="email" placeholder="you@example.com" />
                    </div>

                    <div>
                        <Text style={{ color: "black" }}>Password</Text>
                        <Input.Password placeholder="••••••••" />
                    </div>

                    <Button
                        type="primary"
                        className="w-full !bg-black !border-black hover:!bg-black hover:!border-black focus:!bg-black active:!bg-black"
                        style={{ fontWeight: 600 }}
                    >
                        Sign up
                    </Button>
                </div>

                <div className="mt-6 text-sm">
                    <Text style={{ color: "rgba(0, 0, 0, 0.7)" }}>
                        Already have an account?{" "}
                    </Text>
                    <Button
                        type="link"
                        style={{ color: "#e4202dff", padding: 0 ,fontWeight: 600, textDecoration: "underline" }}
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
