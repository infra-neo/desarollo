import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/constants/adminCredential";
import useLocalStorage from "@/hooks/useLocalStorage";
import React, { createContext, useState } from "react";

type User = {
  id: string | number;
  email: string;
  name: string;
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  login: (userData: User, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

const MOCK_USER = {
  id: 1,
  email: ADMIN_EMAIL,
  name: "admin",
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorage<User>("user", MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(
    "isAuthenticated",
    false
  );

  const authorizeLoginAdmin = (email?: string, password?: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return true;
    }

    return false;
  };

  const login = (userData: User, password: string) => {
    if (authorizeLoginAdmin(userData?.email, password)) {
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
