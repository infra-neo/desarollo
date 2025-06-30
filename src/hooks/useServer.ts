import Servers from "@/services/servers";
import { useQuery } from "@tanstack/react-query";

const useServer = (groupServerGuid: string) => {
  const {
    data: servers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["servers", groupServerGuid],
    queryFn: () => Servers.getServers(groupServerGuid),
    enabled: true,
  });

  return { servers, isLoading, error };
};

export default useServer;
