import { useState, useEffect } from "react";
import SwaggerClient from "swagger-client";
import type { SwaggerEndpoint, GroupedEndpoints } from "@/types/swagger.types";

export const useSwaggerSpec = (swaggerUrl: string = "/swagger.json") => {
  const [endpoints, setEndpoints] = useState<SwaggerEndpoint[]>([]);
  const [groupedEndpoints, setGroupedEndpoints] = useState<GroupedEndpoints>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSwagger = async () => {
      try {
        setLoading(true);
        setError(null);

        const client = await SwaggerClient(swaggerUrl);
        const spec = client.spec;

        const parsedEndpoints: SwaggerEndpoint[] = [];

        // Parse all paths and methods
        if (spec.paths) {
          Object.keys(spec.paths).forEach((path) => {
            const pathItem = spec.paths[path];

            ["get", "post", "put", "delete", "patch"].forEach((method) => {
              if (pathItem[method]) {
                const operation = pathItem[method];

                parsedEndpoints.push({
                  path,
                  method: method.toUpperCase(),
                  summary: operation.summary || operation.operationId || path,
                  description: operation.description || "",
                  operationId: operation.operationId,
                  tags: operation.tags || ["Default"],
                  parameters: operation.parameters || [],
                  requestBody: operation.requestBody,
                });
              }
            });
          });
        }

        setEndpoints(parsedEndpoints);

        // Group endpoints by tag
        const grouped: GroupedEndpoints = {};
        parsedEndpoints.forEach((endpoint) => {
          endpoint.tags?.forEach((tag) => {
            if (!grouped[tag]) {
              grouped[tag] = [];
            }
            grouped[tag].push(endpoint);
          });
        });

        setGroupedEndpoints(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading Swagger");
        console.error("Error loading Swagger:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSwagger();
  }, [swaggerUrl]);

  return { endpoints, groupedEndpoints, loading, error };
};
