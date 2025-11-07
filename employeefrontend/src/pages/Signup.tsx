// import React from "react";
// import { Typography } from "antd";
// import { useNavigate } from "react-router-dom";

// const { Text } = Typography;


// const Signup = () => {
//     const navigate = useNavigate();

//     return (
//         <div
//             className="min-h-screen bg-cover bg-center flex items-center justify-center">
//             {/* Transparent Overlay */}
//             <div className="absolute inset-0 bg-black/30"></div>

//             {/* Signup Card */}
//             <div className="justify-center items-center bg-white/40 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-11/12 max-w-md text-center">

                
//             </div>
//         </div>
//     );
// };

// export default Signup;


import React from "react";
import { Typography, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen  bg-cover bg-center flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Card */}` 1`
      <div className="relative bg-white/40 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-11/12 max-w-md text-center">
        <Title level={2} style={{ color: "white", marginBottom: 4 }}>
          Create your account
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.7)" }}>
          Join the BookFair employee portal
        </Text>

        <div className="mt-6 space-y-4 text-left">
          <div>
            <Text style={{ color: "white" }}>Full Name</Text>
            <Input placeholder="John Doe" />
          </div>

          <div>
            <Text style={{ color: "white" }}>Email</Text>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <div>
            <Text style={{ color: "white" }}>Password</Text>
            <Input.Password placeholder="••••••••" />
          </div>

          <Button
            type="primary"
            className="w-full"
            style={{ fontWeight: 600 }}
          >
            Sign up
          </Button>
        </div>

        <div className="mt-6 text-sm">
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>
            Already have an account?{" "}
          </Text>
          <Button
            type="link"
            style={{ color: "#93c5fd", padding: 0 }}
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
