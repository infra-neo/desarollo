import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ChevronDown, ChevronUp } from "lucide-react";
import type { SwaggerEndpoint } from "@/types/swagger.types";
import EndpointExecutor from "./EndpointExecutor";

interface Props {
  endpoint: SwaggerEndpoint;
}

const getMethodColor = (method: string) => {
  const colors = {
    GET: "bg-blue-500 text-white",
    POST: "bg-green-500 text-white",
    PUT: "bg-yellow-600 text-white",
    DELETE: "bg-red-500 text-white",
    PATCH: "bg-orange-500 text-white",
  };
  return colors[method as keyof typeof colors] || "bg-gray-500 text-white";
};

const EndpointCard = ({ endpoint }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExecutor, setShowExecutor] = useState(false);

  const hasParameters =
    (endpoint.parameters && endpoint.parameters.length > 0) ||
    endpoint.requestBody;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${getMethodColor(
                  endpoint.method
                )}`}
              >
                {endpoint.method}
              </span>
              <code className="text-sm text-gray-600 font-mono truncate">
                {endpoint.path}
              </code>
            </div>
            <CardTitle className="text-lg">{endpoint.summary}</CardTitle>
            {endpoint.description && (
              <p className="text-sm text-gray-600 mt-1">
                {endpoint.description}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              onClick={() => setShowExecutor(!showExecutor)}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Ejecutar
            </Button>
            {hasParameters && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && hasParameters && (
        <CardContent className="pt-0 pb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Parámetros:</h4>
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <ul className="space-y-2">
                {endpoint.parameters.map((param, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-mono text-blue-600">{param.name}</span>
                    {param.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    <span className="text-gray-500 ml-2">
                      ({param.in}) - {param.schema.type}
                    </span>
                    {param.description && (
                      <p className="text-gray-600 ml-4 mt-1">
                        {param.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {endpoint.requestBody && (
              <div className="mt-3">
                <p className="font-semibold text-sm">Request Body:</p>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(endpoint.requestBody, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      )}

      {showExecutor && (
        <CardContent className="pt-0">
          <EndpointExecutor
            endpoint={endpoint}
            onClose={() => setShowExecutor(false)}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default EndpointCard;
