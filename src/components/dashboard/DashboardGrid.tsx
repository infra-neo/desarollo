import { useState } from "react";
import { Loader2 } from "lucide-react";
import ServerCard from "./ServerCard";
import { motion } from "framer-motion";
import ModalCreateServer from "./ModalCreateServer";
import useServer from "@/hooks/useServer";
import { useServerContext } from "@/context/ServerContext";
import ModalConfirmRemove from "./ModalConfirmRemove";
import useRemoveServerGroup from "@/hooks/useRemoveServerGroup";

interface Props {
  groupServerGuid: string;
  groupName: string;
}

const DashboardGrid = ({ groupServerGuid, groupName }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedServer, onServerSelect } = useServerContext();
  const { servers, isLoading } = useServer(groupServerGuid);
  const { removeGroupServer, isOpenConfirmRemove, setOpenConfirmModal } =
    useRemoveServerGroup(groupServerGuid);

  const selectedGuidServer = selectedServer?.guid;

  // Ensure servers is always an array before filtering
  const safeServers = Array.isArray(servers) ? servers : [];
  const filteredServers = safeServers.filter((server) =>
    server.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || !servers) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin" color="blue" size={40} />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Servidores</h2>

        <div className="flex gap-3 items-center">
          <ModalCreateServer groupGuid={groupServerGuid} />
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar servidor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pr-10 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute top-2.5 right-3 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <ModalConfirmRemove
            isOpen={isOpenConfirmRemove}
            setOpen={setOpenConfirmModal}
            onConfirm={removeGroupServer}
            itemName={groupName}
            itemType="group"
          />
        </div>
      </div>

      {filteredServers.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No se encontraron servidores</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServers.map((server, index) => (
            <motion.div
              key={server.guid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <ServerCard
                server={server}
                isSelected={selectedGuidServer === server.guid}
                onClick={onServerSelect}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardGrid;
