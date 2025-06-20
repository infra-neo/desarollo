import useAuth from "@/hooks/auth/useAuth";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

const RedirectToDashboard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default RedirectToDashboard;
