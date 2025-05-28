import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Configuración
          </h1>
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <p className="text-gray-600">
                Configuración general de la aplicación
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
