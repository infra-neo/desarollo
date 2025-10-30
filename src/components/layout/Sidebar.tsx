import { useNavigate, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Activity, LogOut, X, FileJson, Boxes, Cloud } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/assets/logo/Logo_horizontal.png";

interface Props {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar = ({ isMobileOpen, setIsMobileOpen }: Props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  const menuItems = [
    { icon: Activity, label: "Servidores", path: "/dashboard", count: null },
    { icon: Cloud, label: "Multi-Cloud", path: "/clouds", count: null },
    { icon: Boxes, label: "Workspace", path: "/workspace", count: null },
    { icon: FileJson, label: "API Explorer", path: "/swagger-ui", count: null },
    // { icon: Activity, label: "Monitoreo", path: "/monitoring", count: null },
    // { icon: Users, label: "Usuarios", path: "/users", count: null },
    // { icon: Settings, label: "Configuración", path: "/settings", count: null },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Overlay móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-300 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center p-4 border-b border-gray-300">
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center h-16 rounded-lg">
                <img src={Logo} alt="" className="w-full h-full" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Perfil del usuario */}
          <div className="p-6 border-b border-gray-300">
            <div className="flex items-center space-x-3">
              <div className="flex justify-center items-center w-10 h-10 rounded-full card-gradient">
                <span className="text-sm font-medium text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    currentPath === item.path
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Botón de logout */}
          <div className="p-4 border-t border-gray-300">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="justify-start w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-3 w-5 h-5" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
