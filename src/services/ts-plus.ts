import api from "@/utils/api";

// Variables de configuración para pruebas - Modifica estas constantes para tus pruebas
const DEFAULT_LICENSE = import.meta.env.VITE_LICENCE;
const DEFAULT_LICENSE_PATH = import.meta.env.VITE_LICENSE_PATH;

// Clase para manejar todas las solicitudes a la API de TSPlus
class TSPlusAPI {
  static async downloadTSPlus() {
    try {
      const response = await api.post(`/commands/download_tsplus`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al descargar TS Plus: ${error.message}`);
    }
  }
  // Método para obtener información del servidor
  static async getServer(serverId: string) {
    try {
      const response = await api.get(
        `http://localhost:8005/servers/servers/?arg=guid=${serverId}`
      );
      return response.data[0];
    } catch (error: any) {
      throw new Error(`Error al obtener datos del servidor: ${error.message}`);
    }
  }

  static async installVolumeLicenseServer(
    licenseKey: string,
    users: string,
    edition: string,
    supportYears: number,
    activatesecurityaddon?: string,
    comments?: string
  ) {
    try {
      const response = await api.post(
        `/commands/install_tsplus/?license=${licenseKey}`,
        {
          users,
          edition,
          supportyears: supportYears,
          activatesecurityaddon,
          comments,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al instalar servidor de licencias por volumen: ${error.message}`
      );
    }
  }

  // Método para habilitar/deshabilitar licencias de volumen
  static async volumeDisable(
    license: string = DEFAULT_LICENSE,
    option = "disable"
  ) {
    try {
      const response = await api.put(
        `/commands/volume_en_dis/?license=${license}&option=${option}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al procesar volumen: ${error.message}`);
    }
  }

  static async volumeEnable(
    license: string = DEFAULT_LICENSE,
    option = "enable"
  ) {
    try {
      const response = await api.put(
        `/commands/volume_en_dis/?license=${license}&option=${option}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al procesar volumen: ${error.message}`);
    }
  }

  // Método para activar licencias de volumen
  static async volumeActivate(
    license: string = DEFAULT_LICENSE,
    option = "activate"
  ) {
    try {
      const response = await api.put(
        `/commands/volume_en_dis/?license=${license}&option=${option}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al procesar volumen: ${error.message}`);
    }
  }

  // Método para actualizar licencias de volumen
  static async updateVolume(license: string = DEFAULT_LICENSE, users: string) {
    try {
      const response = await api.put(
        `/commands/update_volume/?license=${license}&users=${users}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al actualizar volumen: ${error.message}`);
    }
  }

  // Método para resetear 2FA
  static async reset2FA(user: string) {
    try {
      const response = await api.put(`/2FA_Reset/`, {
        users: [user],
      });
      return response.data;
    } catch (error: any) {
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
      const response = await api.put(`/2FA_Add_Users/`, {
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
    } catch (error: any) {
      throw new Error(`Error al añadir usuarios a 2FA: ${error.message}`);
    }
  }

  // Método para añadir grupos a 2FA
  static async add2FAGroups(group: string) {
    try {
      const response = await api.put(`/2FA_Add_Groups/`, {
        groups: [group],
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al añadir grupos a 2FA: ${error.message}`);
    }
  }

  // Método para listar usuarios de 2FA
  static async list2FAUsers() {
    try {
      const response = await api.get(`/2FA_List_Users/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al listar usuarios de 2FA: ${error.message}`);
    }
  }

  // Método para gestionar créditos de licencia
  static async licenseCredits(
    license: string = DEFAULT_LICENSE,
    edition: string,
    login: string
  ) {
    try {
      const response = await api.put(`/license_credits/?license=${license}`, {
        login,
        edition,
        silent: false,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al gestionar créditos de licencia: ${error.message}`
      );
    }
  }

  // Método para gestionar créditos de soporte
  static async supportCredits(
    license: string = DEFAULT_LICENSE,
    edition: string,
    login: string
  ) {
    try {
      const response = await api.put(`/support_credits/?license=${license}`, {
        login,
        edition,
        silent: false,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Error al gestionar créditos de soporte: ${error.message}`
      );
    }
  }

  // Método para resetear licencia
  static async resetLicense() {
    try {
      const response = await api.put(`/reset_license/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al resetear licencia: ${error.message}`);
    }
  }

  // Método para activar
  static async activate(licensePath: string = DEFAULT_LICENSE_PATH) {
    try {
      const response = await api.post(`/activate/?licensePath=${licensePath}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al activar: ${error.message}`);
    }
  }

  // Método para obtener credenciales web
  static async getWebCredentials() {
    try {
      const response = await api.get(`/web_credentials/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener credenciales web: ${error.message}`);
    }
  }

  // Método para auditoría
  static async audit() {
    try {
      const response = await api.put(`/audit/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en auditoría: ${error.message}`);
    }
  }

  // Método para balanceo de carga
  static async loadBalancing() {
    try {
      const response = await api.put(`/load_balancing/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en balanceo de carga: ${error.message}`);
    }
  }

  // Método para monitor de sesión
  static async sessionMonitor() {
    try {
      const response = await api.put(`/session_monitor/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en monitor de sesión: ${error.message}`);
    }
  }

  // Método para gestor de sesión
  static async sessionManager() {
    try {
      const response = await api.put(`/session_manager/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en gestor de sesión: ${error.message}`);
    }
  }

  // Método para añadir credenciales web
  static async addWebCredentials(
    webLogin: string,
    webPassword: string,
    windowsLogin: string,
    windowsPassword: string,
    maximumCurrentSessions?: number // Corregido: ahora es opcional
  ) {
    try {
      const response = await api.post(`/web_credentials_add/`, {
        webLogin,
        webPassword,
        windowsLogin,
        windowsPassword,
        maximumCurrentSessions, // Se enviará 'undefined' si no se proporciona
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al añadir credenciales web: ${error.message}`);
    }
  }

  // Método para eliminar credenciales web
  static async removeWebCredentials(webLogin: string) {
    try {
      const response = await api.delete(
        `/web_credentials_remove/?webLogin=${webLogin}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al eliminar credenciales web: ${error.message}`);
    }
  }

  // Método para configurar proxy
  static async configureProxy(
    host: string,
    port?: number,
    username?: string,
    password?: string
  ) {
    try {
      const response = await api.post(`/proxy/`, {
        host,
        port,
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al configurar proxy: ${error.message}`);
    }
  }

  // Método para configurar servidor web
  static async configureWebServer(option: string) {
    try {
      const response = await api.post(`/webserver/?option=${option}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al configurar servidor web: ${error.message}`);
    }
  }

  // Método para hacer backup de datos
  static async backupData(optionalPath?: string, silent: boolean = false) {
    try {
      const response = await api.post(`/backup_data/`, {
        optionalPath, // Enviamos la ruta opcional
        silent, // Controlamos el modo silencioso
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al hacer backup de datos: ${error.message}`);
    }
  }

  // Método para restaurar datos
  static async restoreData(backupPath: string, silent: boolean = false) {
    try {
      const response = await api.put(`/restore_data/`, {
        backupPath,
        silent,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al restaurar datos: ${error.message}`);
    }
  }

  // Método para actualizar
  static async update() {
    try {
      const response = await api.put(`/update/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error.message}`);
    }
  }

  // Método para compatibilidad con Windows
  static async windowsCompatibility() {
    try {
      const response = await api.put(`/windows_compatibility/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en compatibilidad con Windows: ${error.message}`);
    }
  }

  // Método para instalar impresora
  static async installPrinter() {
    try {
      const response = await api.post(`/install_printer/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al instalar impresora: ${error.message}`);
    }
  }

  // Método para eliminar impresora
  static async removePrinter() {
    try {
      const response = await api.delete(`/remove_printer/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al eliminar impresora: ${error.message}`);
    }
  }
}

export default TSPlusAPI;
