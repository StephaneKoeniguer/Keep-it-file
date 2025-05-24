import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthProvider";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // if user is not authenticated goes to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // display children components
  return children;
};

export default ProtectedRoute;
