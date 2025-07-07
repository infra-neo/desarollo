import Servers from "@/services/servers";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const useServerGroup = () => {
  const { user } = useAuth();

  const {
    data: serverGroups,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["server-group"],
    queryFn: () => Servers.getGroupServers(user!.enterpriseGuid),
    enabled: !!user,
  });

  return { serverGroups, isLoading, error };
};

export default useServerGroup;
