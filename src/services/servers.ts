import type { GroupServer, Server } from "@/types/server.types";
import api from "@/utils/api";

const BASE_URL = "http://localhost:8000/servers";

const simulateApiCall = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};

const MOCKS_GROUP_SERVERS = [
  {
    nombre: "Grupo BBVA",
    descripcion: "Grupo de servidores BBVA",
    empresa_guid: "1",
    guid: "some-guid-1",
  },
  {
    nombre: "Grupo BCI",
    descripcion: "Grupo de servidores BCI",
    empresa_guid: "1",
    guid: "some-guid-2",
  },
];

const MOCK_SERVERS: Server[] = [
  {
    ip: "192.168.1.1",
    tunel: "https://tunel.miempresa.com",
    nombre: "Servidor 1",
    descripcion: "Servidor de pruebas",
    grupo_guid: "some-guid-1",
    guid: "some-guid-1",
  },
  {
    ip: "192.168.1.2",
    tunel: "https://tunel.miempresa.com",
    nombre: "Servidor 2",
    descripcion: "Servidor de pruebas",
    grupo_guid: "some-guid-2",
    guid: "some-guid-2",
  },
];

class Servers {
  static async getGroupServers(empresaId: string): Promise<GroupServer[]> {
    const response = await api.get<GroupServer[]>(
      `/groups/?empresaId=${empresaId}`
    );
    return response.data;
  }

  static async getServers(groupServersGuid: string): Promise<Server[]> {
    const response = await api.get<Server[]>(
      `/servers/?group_guid=${groupServersGuid}`
    );

    return response.data;
  }
}

export default Servers;
