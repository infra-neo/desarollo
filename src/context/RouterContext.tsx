import { createContext, useState, useEffect, type ReactNode } from "react";

type RouterContextType = {
  currentPath: string;
  navigate: (path: string) => void;
};

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProps {
  children: ReactNode;
}

const Router = ({ children }: RouterProps) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, "", path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export { RouterContext, Router };
