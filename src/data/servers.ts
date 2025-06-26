export interface Server {
  guid: string;
  name: string;
  url: string;
  icon: string;
  status: string;
  cpu: number;
  memory: number;
  uptime: string;
  groupId: string;
}

export interface ServerGroup {
  guid: string;
  name: string;
  description: string;
  icon: string;
}

export const serverGroups: ServerGroup[] = [
  {
    guid: "some-guid-1",
    name: "Producción",
    description: "Servidores en ambiente de producción",
    icon: "server",
  },
  {
    guid: "some-guid-2",
    name: "Desarrollo",
    description: "Servidores de pruebas y desarrollo",
    icon: "code",
  },
];

export const servers: Server[] = [
  {
    guid: "some-guid-1",
    name: "Servidor Web Principal",
    url: "https://web.miempresa.com",
    icon: "cloud",
    status: "online",
    cpu: 45,
    memory: 62,
    uptime: "15 días",
    groupId: "some-guid-1",
  },
  {
    guid: "some-guid-2",
    name: "Base de Datos MySQL",
    url: "mysql://db.miempresa.com",
    icon: "database",
    status: "online",
    cpu: 23,
    memory: 78,
    uptime: "23 días",
    groupId: "some-guid-2",
  },
  {
    guid: "some-guid-3",
    name: "Servidor de Pruebas",
    url: "https://test.miempresa.com",
    icon: "beaker",
    status: "online",
    cpu: 15,
    memory: 40,
    uptime: "7 días",
    groupId: "some-guid-3",
  },
];
