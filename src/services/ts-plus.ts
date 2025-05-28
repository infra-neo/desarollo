import axios from "axios";

// URL base para todas las solicitudes a la API de TSPlus
const BASE_URL = "http://127.0.0.1:8020/tsplus";

// Clase para manejar todas las solicitudes a la API de TSPlus
class TSPlusAPI {
  // Método para obtener información del servidor
  static async getServer(serverId: string) {
    try {
      const response = await axios.get(
        `http://localhost:8005/servers/servers/?arg=guid=${serverId}`
      );
      return response.data[0];
    } catch (error) {
      throw new Error(`Error al obtener datos del servidor: ${error.message}`);
    }
  }

  // Método para habilitar/deshabilitar licencias de volumen
  static async volumeEnableDisable(license: string, option: string) {
    try {
      const response = await axios.put(
        `${BASE_URL}/volume_en_dis/?license=${license}&option=${option}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al procesar volumen: ${error.message}`);
    }
  }

  // Método para activar licencias de volumen
  static async volumeActivate(
    license: string,
    users: number,
    edition: string,
    supportYears: number
  ) {
    try {
      const response = await axios.post(
        `${BASE_URL}/volume_act/?license=${license}`,
        {
          users,
          edition,
          supportyears: supportYears,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al activar volumen: ${error.message}`);
    }
  }

  // Método para actualizar licencias de volumen
  static async updateVolume(license: string, users: number) {
    try {
      const response = await axios.put(
        `${BASE_URL}/volume_en_dis/?license=${license}&users=${users}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar volumen: ${error.message}`);
    }
  }

  // Método para resetear 2FA
  static async reset2FA(user: string) {
    try {
      const response = await axios.put(`${BASE_URL}/2FA_Reset/`, {
        users: [user],
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al resetear 2FA: ${error.message}`);
    }
  }

  // Método para añadir usuarios a 2FA
  static async add2FAUsers(
    domainName: string,
    receivedMethod: string,
    mobilePhone: string,
    email: string
  ) {
    try {
      const response = await axios.put(`${BASE_URL}/2FA_Add_Users/`, {
        users: [
          {
            domainName,
            receivedMethod,
            mobilePhone,
            email,
          },
        ],
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al añadir usuarios a 2FA: ${error.message}`);
    }
  }

  // Método para añadir grupos a 2FA
  static async add2FAGroups(group: string) {
    try {
      const response = await axios.put(`${BASE_URL}/2FA_Add_Groups/`, {
        groups: [group],
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al añadir grupos a 2FA: ${error.message}`);
    }
  }

  // Método para listar usuarios de 2FA
  static async list2FAUsers() {
    try {
      const response = await axios.get(`${BASE_URL}/2FA_List_Users/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al listar usuarios de 2FA: ${error.message}`);
    }
  }

  // Método para gestionar créditos de licencia
  static async licenseCredits(license: string, users: number, edition: string) {
    try {
      const response = await axios.put(
        `${BASE_URL}/license_credits/?license=${license}`,
        {
          users,
          edition,
          silent: false,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Error al gestionar créditos de licencia: ${error.message}`
      );
    }
  }

  // Método para gestionar créditos de soporte
  static async supportCredits(license: string, users: number, edition: string) {
    try {
      const response = await axios.put(
        `${BASE_URL}/support_credits/?license=${license}`,
        {
          users,
          edition,
          silent: false,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Error al gestionar créditos de soporte: ${error.message}`
      );
    }
  }

  // Método para resetear licencia
  static async resetLicense() {
    try {
      const response = await axios.put(`${BASE_URL}/reset_license/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al resetear licencia: ${error.message}`);
    }
  }

  // Método para activar
  static async activate(licensePath: string) {
    try {
      const response = await axios.post(
        `${BASE_URL}/volume_en_dis/?licensePath=${licensePath}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al activar: ${error.message}`);
    }
  }

  // Método para obtener credenciales web
  static async getWebCredentials() {
    try {
      const response = await axios.get(`${BASE_URL}/web_credentials/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener credenciales web: ${error.message}`);
    }
  }

  // Método para auditoría
  static async audit() {
    try {
      const response = await axios.put(`${BASE_URL}/audit/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error en auditoría: ${error.message}`);
    }
  }

  // Método para balanceo de carga
  static async loadBalancing() {
    try {
      const response = await axios.put(`${BASE_URL}/load_balancing/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error en balanceo de carga: ${error.message}`);
    }
  }

  // Método para monitor de sesión
  static async sessionMonitor() {
    try {
      const response = await axios.put(`${BASE_URL}/session_monitor/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error en monitor de sesión: ${error.message}`);
    }
  }

  // Método para gestor de sesión
  static async sessionManager() {
    try {
      const response = await axios.put(`${BASE_URL}/session_manager/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error en gestor de sesión: ${error.message}`);
    }
  }

  // Método para añadir credenciales web
  static async addWebCredentials(
    webLogin: string,
    webPassword: string,
    windowsLogin: string,
    windowsPassword: string,
    maximumCurrentSessions: number
  ) {
    try {
      const response = await axios.post(`${BASE_URL}/web_credentials_add/`, {
        webLogin,
        webPassword,
        windowsLogin,
        windowsPassword,
        maximumCurrentSessions,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al añadir credenciales web: ${error.message}`);
    }
  }

  // Método para eliminar credenciales web
  static async removeWebCredentials(webLogin: string) {
    try {
      const response = await axios.delete(
        `${BASE_URL}/web_credentials_remove/?webLogin=${webLogin}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar credenciales web: ${error.message}`);
    }
  }

  // Método para configurar proxy
  static async configureProxy(
    host: string,
    port: number,
    username: string,
    password: string
  ) {
    try {
      const response = await axios.post(`${BASE_URL}/proxy/`, {
        host,
        port,
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al configurar proxy: ${error.message}`);
    }
  }

  // Método para configurar servidor web
  static async configureWebServer(option: string) {
    try {
      const response = await axios.post(
        `${BASE_URL}/webserver/?option=${option}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al configurar servidor web: ${error.message}`);
    }
  }

  // Método para hacer backup de datos
  static async backupData(users: string[]) {
    try {
      const response = await axios.post(`${BASE_URL}/backup_data/`, {
        users,
        silent: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al hacer backup de datos: ${error.message}`);
    }
  }

  // Método para restaurar datos
  static async restoreData(users: string[]) {
    try {
      const response = await axios.put(`${BASE_URL}/restore_data/`, {
        users,
        silent: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al restaurar datos: ${error.message}`);
    }
  }

  // Método para actualizar
  static async update() {
    try {
      const response = await axios.put(`${BASE_URL}/update/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar: ${error.message}`);
    }
  }

  // Método para compatibilidad con Windows
  static async windowsCompatibility() {
    try {
      const response = await axios.put(`${BASE_URL}/windows_compatibility/`);
      return response.data;
    } catch (error) {
      throw new Error(`Error en compatibilidad con Windows: ${error.message}`);
    }
  }

  // Método para instalar impresora
  static async installPrinter(printerName: string) {
    try {
      const response = await axios.post(`${BASE_URL}/install_printer/`, {
        printerName,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al instalar impresora: ${error.message}`);
    }
  }

  // Método para eliminar impresora
  static async removePrinter(printerName: string) {
    try {
      const response = await axios.delete(`${BASE_URL}/remove_printer/`, {
        printerName,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar impresora: ${error.message}`);
    }
  }
}

export default TSPlusAPI;
