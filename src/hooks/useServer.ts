import Servers from "@/services/servers";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const useServer = (groupServerGuid: string) => {
  const [artificialLoading, setArtificialLoading] = useState(true);

  const {
    data: servers,
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: ["servers", groupServerGuid],
    queryFn: () => Servers.getServers(groupServerGuid),
    enabled: !!groupServerGuid,
  });

  // Mantener el estado de carga por al menos 500ms
  useEffect(() => {
    if (!queryLoading) {
      const timer = setTimeout(() => {
        setArtificialLoading(false);
      }, 500); // 500ms de carga mínima

      return () => clearTimeout(timer);
    } else {
      setArtificialLoading(true);
    }
  }, [queryLoading]);

  const isLoading = queryLoading || artificialLoading;

  return { servers, isLoading, error };
};

export default useServer;
