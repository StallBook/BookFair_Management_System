import React from "react";
import { Route,Routes } from "react-router-dom";
import Signup from "../pages/Signup";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
