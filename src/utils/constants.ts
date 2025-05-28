import { Home, Server, Activity, Users, Settings } from "lucide-react";

export const menuItems = [
  { icon: Home, label: "Inicio", path: "/dashboard" },
  { icon: Server, label: "Servidores", path: "/servers", count: 8 },
  { icon: Activity, label: "Monitoreo", path: "/monitoring" },
  { icon: Users, label: "Usuarios", path: "/users" },
  { icon: Settings, label: "Configuración", path: "/settings" },
];

export const serverActions = [
  { value: "restart", label: "Reiniciar Servidor" },
  { value: "backup", label: "Crear Respaldo" },
  { value: "update", label: "Actualizar Sistema" },
  { value: "monitor", label: "Iniciar Monitoreo" },
];
