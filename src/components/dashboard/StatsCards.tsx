import { Card, CardContent } from "@/components/ui/card";
import { Activity, Database, Server, Users } from "lucide-react";
import { motion } from "framer-motion";

const StatsCards = () => {
  const stats = [
    {
      title: "Servidores Activos",
      value: "8",
      change: "+2",
      icon: Server,
      color: "bg-blue-500",
    },
    {
      title: "Uso Promedio CPU",
      value: "42%",
      change: "-8%",
      icon: Activity,
      color: "bg-green-500",
    },
    {
      title: "Bases de Datos",
      value: "12",
      change: "+1",
      icon: Database,
      color: "bg-purple-500",
    },
    {
      title: "Usuarios Activos",
      value: "24",
      change: "+6",
      icon: Users,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline mt-1">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`ml-2 text-sm font-medium ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon
                    className={`w-5 h-5 ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
