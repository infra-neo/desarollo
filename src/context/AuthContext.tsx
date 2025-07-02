import { ADMIN_EMAIL } from "@/constants/adminCredential";
import useLocalStorage from "@/hooks/useLocalStorage";
import Auth from "@/services/auth";
import User from "@/services/user";
import { AUTH_EVENTS } from "@/utils/api";
import type { LoginFormData } from "@/utils/validations";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: LoginFormData) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => Promise.resolve(),
  logout: () => {},
  loading: false,
});

const MOCK_USER = {
  id: 1,
  email: ADMIN_EMAIL,
  name: "admin",
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>("user", MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(
    "isAuthenticated",
    false
  );
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const resetAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (userData: LoginFormData) => {
    if (!userData) return;

    try {
      await Auth.login(userData.email, userData.password);
      const responseGetUser = await User.getUserData();
      setUser(responseGetUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error in login:", error);
      toast.error(
        "Credenciales incorrectas. Verifica que el usuario y contraseña sean correctas"
      );
      resetAuthState();
    }
  };

  const logout = async () => {
    try {
      await Auth.logout();
      resetAuthState();
      navigate("/auth");
    } catch (error) {
      console.error("Error in logout:", error);
      resetAuthState();
    }
  };

  useEffect(() => {
    // Listen for authentication failure events from the API utility
    const handleAuthFailure = () => {
      console.log("Auth failure event received, calling logout");
      logout(); // Call the logout function to handle everything
    };

    // Add event listener for auth failures
    window.addEventListener(AUTH_EVENTS.AUTH_FAILED, handleAuthFailure);

    // Check authentication status on mount
    const checkAuthentication = async () => {
      try {
        const authResponse = await Auth.checkAuth();

        if (authResponse.authenticated) {
          try {
            const userData = await User.getUserData();
            setUser(userData);
            setIsAuthenticated(true);
            return;
          } catch (userError) {
            console.error("Error al obtener datos del usuario:", userError);
          }
        }
        resetAuthState();
      } catch (authError) {
        console.error("Error al verificar autenticación:", authError);
        resetAuthState();
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener(AUTH_EVENTS.AUTH_FAILED, handleAuthFailure);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
