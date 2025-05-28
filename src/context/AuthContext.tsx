import React, { createContext, useState } from "react";

type User = {
  id: string | number;
  email: string;
  name: string;
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const MOCK_USER = {
  id: 1,
  email: "diego@web.com",
  name: "Diego",
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
