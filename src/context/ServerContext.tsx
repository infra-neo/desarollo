import type { Server } from "@/types/server.types";
import { createContext, useContext, useState } from "react";

type ServerContextType = {
  selectedServer: Server | null;
  onServerSelect: (server: Server | null) => void;
};

const ServerContext = createContext<ServerContextType>({
  selectedServer: null,
  onServerSelect: () => {},
});

const ServerProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  const onServerSelect = (server: Server | null) => {
    setSelectedServer(server);
  };

  return (
    <ServerContext.Provider value={{ selectedServer, onServerSelect }}>
      {children}
    </ServerContext.Provider>
  );
};

const useServerContext = () => {
  const context = useContext(ServerContext);

  if (!context) {
    throw new Error("useServer must be used within a ServerProvider");
  }

  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { ServerProvider, useServerContext };
