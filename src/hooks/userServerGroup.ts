import Servers from "@/services/servers";
import { useQuery } from "@tanstack/react-query";

const useServerGroup = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["server-group"],
    queryFn: () => Servers.getGroupServers(),
    enabled: true,
  });

  return { data, isLoading, error };
};

export default useServerGroup;
