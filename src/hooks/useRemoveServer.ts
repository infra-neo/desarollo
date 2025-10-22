import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Servers from "@/services/servers";

const useRemoveServer = (serverGuid: string, groupGuid: string) => {
  const [isOpenConfirmRemove, setOpenConfirmModal] = useState(false);
  const queryClient = useQueryClient();

  const removeServer = async () => {
    try {
      await Servers.removeServer(serverGuid);
      queryClient.invalidateQueries({
        queryKey: ["servers", groupGuid],
      });
    } catch {
      console.error("Error al eliminar el servidor");
    }
  };

  return {
    isOpenConfirmRemove,
    setOpenConfirmModal,
    removeServer,
  };
};

export default useRemoveServer;
