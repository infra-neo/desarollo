export interface Server {
  id: number;
  name: string;
  url: string;
  icon: string;
  status: string;
  cpu: number;
  memory: number;
  uptime: string;
  groupId: number;
}

export interface ServerGroup {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export const serverGroups: ServerGroup[] = [
  {
    id: 1,
    name: "Producción",
    description: "Servidores en ambiente de producción",
    icon: "server"
  },
  {
    id: 2,
    name: "Desarrollo",
    description: "Servidores de pruebas y desarrollo",
    icon: "code"
  }
];

export const servers: Server[] = [
  {
    id: 1,
    name: "Servidor Web Principal",
    url: "https://web.miempresa.com",
    icon: "cloud",
    status: "online",
    cpu: 45,
    memory: 62,
    uptime: "15 días",
    groupId: 1
  },
  {
    id: 2,
    name: "Base de Datos MySQL",
    url: "mysql://db.miempresa.com",
    icon: "database",
    status: "online",
    cpu: 23,
    memory: 78,
    uptime: "23 días",
    groupId: 1
  },
  {
    id: 3,
    name: "Servidor de Pruebas",
    url: "https://test.miempresa.com",
    icon: "beaker",
    status: "online",
    cpu: 15,
    memory: 40,
    uptime: "7 días",
    groupId: 2
  }
];
