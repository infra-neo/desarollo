import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const UsersPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <p className="text-gray-600">
                Administración de usuarios y permisos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
