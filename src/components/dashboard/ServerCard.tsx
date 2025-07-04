import { Card, CardContent } from "@/components/ui/card";
import type { Server as ServerType } from "@/types/server.types";
import { Server, ChevronRight } from "lucide-react";
import DropdownServer from "./DropdownServer";
import ModalConfirmRemove from "./ModalConfirmRemove";
import useRemoveServer from "@/hooks/useRemoveServer";

interface Props {
  server: ServerType;
  isSelected: boolean;
  onClick: (server: ServerType) => void;
}

const ServerCard = ({ server, isSelected, onClick }: Props) => {
  const isOnline = true;
  const IconComponent = Server;

  const { removeServer, isOpenConfirmRemove, setOpenConfirmModal } =
    useRemoveServer(server.guid, server.grupo_guid);

  return (
    <>
      <Card
        className={`
        relative cursor-pointer transition-all duration-300 ring-2 ring-gray-200
        ${isSelected ? "ring-blue-500 shadow-lg" : "hover:shadow-lg"}
        bg-gradient-to-br from-white to-gray-50 border-0 shadow-sm
      `}
        onClick={() => onClick(server)}
      >
        <DropdownServer
          className="absolute right-1 top-2"
          onOpenChange={setOpenConfirmModal}
        />

        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div
              className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${
              isOnline
                ? "card-gradient"
                : "bg-gradient-to-r from-red-400 to-red-600"
            }
          `}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div
              className={`
            w-3 h-3 rounded-full
            ${isOnline ? "bg-green-500" : "bg-red-500"}
          `}
            />
          </div>

          <h3 className="mb-1 font-semibold text-gray-900">{server.nombre}</h3>
          <p className="mb-3 text-sm text-gray-500 truncate">{server.ip}</p>

          <div className="flex justify-between items-center text-xs">
            <span
              className={`
            px-2 py-1 rounded-full font-medium
            ${
              isOnline
                ? "text-green-800 bg-green-100"
                : "text-red-800 bg-red-100"
            }
          `}
            >
              {isOnline ? "En línea" : "Desconectado"}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <ModalConfirmRemove
        isOpen={isOpenConfirmRemove}
        setOpen={setOpenConfirmModal}
        onConfirm={removeServer}
        itemName={server.nombre}
        itemType="server"
        dialogTrigger={false}
      />
    </>
  );
};

export default ServerCard;
