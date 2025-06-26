import type { GroupServer } from "@/types/server.types";
import axios from "axios";

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
}

export default Servers;
