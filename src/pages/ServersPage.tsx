import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Server } from "lucide-react";

const ServersPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Gestión de Servidores
          </h1>
          <Card>
            <CardContent className="p-8 text-center">
              <Server className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <p className="text-gray-600">
                Página de gestión detallada de servidores
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServersPage;
