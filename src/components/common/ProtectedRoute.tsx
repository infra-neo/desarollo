import { Navigate } from "react-router";
import useAuth from "@/hooks/auth/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
