import type { GroupServer } from "@/types/server.types";
import type { Server } from "@/types/server.types";

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

const MOCK_SERVERS = [
  {
    ip: "192.168.1.1",
    tunel: "192.168.1.2",
    nombre: "Servidor de prueba",
    descripcion: "Servidor de prueba",
    grupo_guid: "1",
    guid: "some-guid-1",
  },
  {
    ip: "172.16.1.1",
    tunel: "172.16.1.2",
    nombre: "Servidor de produccion",
    descripcion: "Servidor de produccion",
    grupo_guid: "2",
    guid: "some-guid-2",
  },
  {
    ip: "10.0.0.1",
    tunel: "10.0.0.2",
    nombre: "Servidor de desarrollo",
    descripcion: "Servidor de desarrollo",
    grupo_guid: "3",
    guid: "some-guid-3",
  },
];

class Servers {
  static async getGroupServers(): Promise<GroupServer[]> {
    try {
      const response = (await simulateApiCall(
        MOCKS_GROUP_SERVERS
      )) as GroupServer[];
      return response;
    } catch (error) {
      throw new Error(
        `Error al obtener grupos de servidores: ${error.message}`
      );
    }
  }

  static async getServers(serverId: string): Promise<Server[]> {
    try {
      const response = (await simulateApiCall(MOCK_SERVERS)) as Server[];
      return response;
    } catch (error) {
      throw new Error(`Error al obtener servidores: ${error.message}`);
    }
  }
}

export default Servers;
