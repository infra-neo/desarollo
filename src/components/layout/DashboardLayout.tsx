import type { ReactNode } from "react";
import { Button } from "../ui/button";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-app-gradient-light">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      <div className="flex overflow-hidden flex-col flex-1">
        {/* Header móvil */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-gray-900">Panel de Servidores</h1>
          <div className="w-8" />
        </div>

        {/* Contenido principal */}
        <main className="overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
