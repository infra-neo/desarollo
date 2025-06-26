import { useState } from "react";
import { Grid } from "lucide-react";
import ServerCard from "./ServerCard";
import { motion } from "framer-motion";
import ModalCreateServer from "./ModalCreateServer";

interface Props {
  servers: any[];
  selectedServer: any;
  onServerSelect: (server: any) => void;
}

const DashboardGrid = ({ servers, selectedServer, onServerSelect }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServers = servers.filter((server) =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Servidores</h2>

        <div className="flex gap-3 items-center">
          <ModalCreateServer />
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
          <button className="flex justify-center items-center p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {filteredServers.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No se encontraron servidores</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServers.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <ServerCard
                server={server}
                isSelected={selectedServer?.id === server.id}
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
