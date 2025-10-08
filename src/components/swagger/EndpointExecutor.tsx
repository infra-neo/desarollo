import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import type { SwaggerEndpoint } from "@/types/swagger.types";
import api from "@/utils/api";
import { toast } from "sonner";

interface Props {
  endpoint: SwaggerEndpoint;
  onClose: () => void;
}

const EndpointExecutor = ({ endpoint, onClose }: Props) => {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValues, setBodyValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (name: string, value: string) => {
    setBodyValues((prev) => ({ ...prev, [name]: value }));
  };

  const executeEndpoint = async () => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      // Build URL with query parameters
      let url = endpoint.path;
      const queryParams: string[] = [];

      endpoint.parameters?.forEach((param) => {
        if (param.in === "query" && paramValues[param.name]) {
          queryParams.push(
            `${param.name}=${encodeURIComponent(paramValues[param.name])}`
          );
        }
      });

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      // Build request body
      let requestBody = undefined;
      if (endpoint.requestBody && Object.keys(bodyValues).length > 0) {
        requestBody = bodyValues;
      }

      // Execute request
      let result;
      const method = endpoint.method.toLowerCase();

      switch (method) {
        case "get":
          result = await api.get(url);
          break;
        case "post":
          result = await api.post(url, requestBody);
          break;
        case "put":
          result = await api.put(url, requestBody);
          break;
        case "delete":
          result = await api.delete(url);
          break;
        case "patch":
          result = await api.patch(url, requestBody);
          break;
        default:
          throw new Error(`Método ${method} no soportado`);
      }

      setResponse(result.data);
      toast.success("Endpoint ejecutado correctamente");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error al ejecutar el endpoint";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getBodySchema = () => {
    if (!endpoint.requestBody) return null;

    const content =
      endpoint.requestBody.content["application/json"] ||
      endpoint.requestBody.content[
        Object.keys(endpoint.requestBody.content)[0]
      ];

    return content?.schema;
  };

  const bodySchema = getBodySchema();

  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Ejecutar Endpoint</h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Query Parameters */}
      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium text-sm">Parámetros:</h5>
          {endpoint.parameters.map((param) => (
            <div key={param.name}>
              <Label htmlFor={param.name} className="text-sm">
                {param.name}
                {param.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={param.name}
                type="text"
                placeholder={param.description || param.name}
                value={paramValues[param.name] || ""}
                onChange={(e) => handleParamChange(param.name, e.target.value)}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      )}

      {/* Request Body */}
      {bodySchema && bodySchema.properties && (
        <div className="space-y-3">
          <h5 className="font-medium text-sm">Body (JSON):</h5>
          {Object.entries(bodySchema.properties).map(([key, prop]: [string, any]) => (
            <div key={key}>
              <Label htmlFor={key} className="text-sm">
                {key}
                {bodySchema.required?.includes(key) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Input
                id={key}
                type={prop.type === "number" ? "number" : "text"}
                placeholder={prop.description || key}
                value={bodyValues[key] || ""}
                onChange={(e) => handleBodyChange(key, e.target.value)}
                className="mt-1"
              />
              {prop.description && (
                <p className="text-xs text-gray-500 mt-1">{prop.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Execute Button */}
      <Button
        onClick={executeEndpoint}
        disabled={loading}
        className="w-full gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Ejecutando...
          </>
        ) : (
          "Ejecutar"
        )}
      </Button>

      {/* Response Display */}
      {response && (
        <div className="mt-4">
          <h5 className="font-medium text-sm mb-2 text-green-600">
            Respuesta:
          </h5>
          <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-96">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4">
          <h5 className="font-medium text-sm mb-2 text-red-600">Error:</h5>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm text-red-800">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default EndpointExecutor;
