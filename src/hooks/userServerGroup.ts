import Servers from "@/services/servers";
import { useQuery } from "@tanstack/react-query";

const useServerGroup = () => {
  const {
    data: serverGroups,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["server-group"],
    queryFn: () => Servers.getGroupServers(),
    enabled: true,
  });

  return { serverGroups, isLoading, error };
};

export default useServerGroup;
