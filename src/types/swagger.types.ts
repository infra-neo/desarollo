export interface SwaggerEndpoint {
  path: string;
  method: string;
  summary: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: SwaggerParameter[];
  requestBody?: SwaggerRequestBody;
}

export interface SwaggerParameter {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  description?: string;
  required?: boolean;
  schema: {
    type: string;
    enum?: string[];
  };
}

export interface SwaggerRequestBody {
  required?: boolean;
  content: {
    [contentType: string]: {
      schema: SwaggerSchema;
    };
  };
}

export interface SwaggerSchema {
  type: string;
  properties?: {
    [key: string]: {
      type: string;
      description?: string;
      enum?: string[];
    };
  };
  required?: string[];
}

export interface EndpointExecution {
  endpoint: SwaggerEndpoint;
  loading: boolean;
  response?: any;
  error?: string;
}

export interface GroupedEndpoints {
  [tag: string]: SwaggerEndpoint[];
}
