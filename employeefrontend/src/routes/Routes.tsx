import React from "react";
import { Route,Routes } from "react-router-dom";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
};

export default AppRoutes;
