import Servers from "@/services/servers";
import { useQuery } from "@tanstack/react-query";

const useServer = () => {
  const {
    data: servers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["servers", "some-guid-1"],
    queryFn: () => Servers.getServers("some-guid-1"),
    enabled: true,
  });

  return { servers, isLoading, error };
};

export default useServer;
