import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSwaggerSpec } from "@/hooks/useSwaggerSpec";
import EndpointCard from "@/components/swagger/EndpointCard";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, FileJson } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SwaggerUIPage = () => {
  const { groupedEndpoints, loading, error } = useSwaggerSpec();
  const [searchTerm, setSearchTerm] = useState("");

  const filterEndpoints = (endpoints: any[]) => {
    if (!Array.isArray(endpoints)) return [];
    if (!searchTerm) return endpoints;
    return endpoints.filter(
      (endpoint) =>
        endpoint?.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint?.path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileJson className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-transparent bg-clip-text card-gradient">
                API Explorer - Swagger UI
              </h1>
            </div>
            <p className="text-gray-600">
              Explora y ejecuta los endpoints de la API de forma interactiva
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar endpoints por nombre, ruta o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Cargando especificación Swagger...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">
                  Error al cargar Swagger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{error}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Asegúrate de que el archivo swagger.json esté disponible en /public/swagger.json
                </p>
              </CardContent>
            </Card>
          )}

          {/* Endpoints by Tag */}
          {!loading && !error && (
            <AnimatePresence>
              {Object.keys(groupedEndpoints).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600">
                      No se encontraron endpoints en la especificación Swagger
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedEndpoints).map(([tag, endpoints], index) => {
                    const filteredEndpoints = filterEndpoints(endpoints);
                    
                    if (filteredEndpoints.length === 0) return null;

                    return (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="mb-4">
                          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded"></span>
                            {tag}
                          </h2>
                          <p className="text-gray-600 ml-4">
                            {filteredEndpoints.length} endpoint
                            {filteredEndpoints.length !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 ml-4">
                          {filteredEndpoints.map((endpoint, idx) => (
                            <motion.div
                              key={`${endpoint.path}-${endpoint.method}-${idx}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + idx * 0.05 }}
                            >
                              <EndpointCard endpoint={endpoint} />
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SwaggerUIPage;
