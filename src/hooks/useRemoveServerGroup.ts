import Servers from "@/services/servers";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const useRemoveServerGroup = (groupServerGuid: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const removeGroupServer = async () => {
    try {
      await Servers.removeGroupServer(groupServerGuid);
      queryClient.invalidateQueries({
        queryKey: ["server-group"],
      });
    } catch {
      console.error("Error al eliminar el grupo de servidores");
    }
  };

  return {
    isOpenConfirmRemove: isOpen,
    removeGroupServer,
    setOpenConfirmModal: setIsOpen,
  };
};

export default useRemoveServerGroup;
