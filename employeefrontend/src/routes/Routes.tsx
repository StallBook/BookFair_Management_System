import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Stalls from "../pages/Dashboard";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("sb_token");
  return token ? <>{children}</> : <Navigate to="/signin" replace />;
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Stalls />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
