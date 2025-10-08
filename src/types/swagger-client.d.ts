declare module "swagger-client" {
  export default function SwaggerClient(url: string | object): Promise<any>;
}
