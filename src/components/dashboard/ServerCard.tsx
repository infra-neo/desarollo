import { Card, CardContent } from "@/components/ui/card";
import {
  Database,
  Cloud,
  Monitor,
  Wifi,
  Shield,
  Server,
  ChevronRight,
} from "lucide-react";

interface Props {
  server: any;
  isSelected: boolean;
  onClick: (server: any) => void;
}

const ServerCard = ({ server, isSelected, onClick }: Props) => {
  const iconMap: Record<string, any> = {
    database: Database,
    cloud: Cloud,
    monitor: Monitor,
    wifi: Wifi,
    shield: Shield,
  };

  const IconComponent = iconMap[server.icon] || Server;

  return (
    <Card
      className={`
        cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl
        ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"}
        bg-gradient-to-br from-white to-gray-50 border-0 shadow-sm
      `}
      onClick={() => onClick(server)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div
            className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${
              server.status === "online"
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
            ${server.status === "online" ? "bg-green-500" : "bg-red-500"}
          `}
          />
        </div>

        <h3 className="mb-1 font-semibold text-gray-900">{server.name}</h3>
        <p className="mb-3 text-sm text-gray-500 truncate">{server.url}</p>

        <div className="flex justify-between items-center text-xs">
          <span
            className={`
            px-2 py-1 rounded-full font-medium
            ${
              server.status === "online"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          `}
          >
            {server.status === "online" ? "En línea" : "Desconectado"}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerCard;
