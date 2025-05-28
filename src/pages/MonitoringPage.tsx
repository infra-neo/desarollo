import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

const MonitoringPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Monitoreo en Tiempo Real
          </h1>
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <p className="text-gray-600">Dashboard de métricas y monitoreo</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MonitoringPage;
