import { useState } from "react";
import type { ServerGroup, Server } from "../../data/servers";
import { motion, AnimatePresence } from "framer-motion";
import DashboardGrid from "./DashboardGrid";
import { Button } from "@/components/ui/button";
import { cardVariants, containerVariants } from "@/utils/animations";
import { Loader2 } from "lucide-react";

interface ServerGroupCardsProps {
  groups: ServerGroup[];
  servers: Server[];
  selectedServer: Server | null;
  onServerSelect: (server: Server | null) => void;
  isLoading: boolean;
}

const ServerGroupCards = ({
  groups,
  servers,
  selectedServer,
  onServerSelect,
  isLoading,
}: ServerGroupCardsProps) => {
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);

  const toggleGroup = (groupId: number) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-36">
        <Loader2 className="animate-spin" color="blue" size={40} />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {groups.map((group) => (
        <motion.div
          key={group.id}
          className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
          variants={cardVariants}
        >
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => toggleGroup(group.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-indigo-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-800 dark:text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {group.description}
                </p>
              </div>
            </div>
            <Button variant="gradient">
              {expandedGroupId === group.id
                ? "Ocultar servidores"
                : "Ver servidores"}
            </Button>
          </div>

          <AnimatePresence>
            {expandedGroupId === group.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <DashboardGrid
                    servers={servers.filter(
                      (server) => server.groupId === group.id
                    )}
                    selectedServer={selectedServer}
                    onServerSelect={onServerSelect}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ServerGroupCards;
