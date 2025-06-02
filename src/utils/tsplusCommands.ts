import TSPlusAPI from "@/services/ts-plus";
import type { CommandDefinition } from "@/types/command.types";

const AVAILABLE_COMMANDS: CommandDefinition[] = [
  {
    id: "2FA_Add_Groups",
    name: "2FA - Añadir Grupo",
    params: [{ id: "group", name: "Grupo", type: "text" }],
    method: TSPlusAPI.add2FAGroups,
  },
  {
    id: "2FA_Add_Users",
    name: "2FA - Añadir users",
    params: [
      { id: "domainName", name: "Nombre de Dominio", type: "text" },
      { id: "receivedMethod", name: "Método de Recepción", type: "text" },
      { id: "mobilePhone", name: "Teléfono Móvil", type: "text" },
      { id: "email", name: "Email", type: "email" },
    ],
    method: TSPlusAPI.add2FAUsers,
  },
  {
    id: "2FA_List_Users",
    name: "2FA - Listar Usuarios",
    params: [],
    method: TSPlusAPI.list2FAUsers,
  },
  {
    id: "2FA_Reset",
    name: "2FA - Resetear Usuario",
    params: [{ id: "user", name: "Usuario", type: "text" }],
    method: TSPlusAPI.reset2FA,
  },
  {
    id: "activate",
    name: "Activación de licencia",
    params: [{ id: "licensePath", name: "Ruta de Licencia", type: "text" }],
    method: TSPlusAPI.activate,
  },
  {
    id: "volume_act",
    name: "Activar Licencia de Volumen",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "users", name: "Usuarios", type: "number" },
      { id: "edition", name: "Edición", type: "text" },
      { id: "supportYears", name: "Años de Soporte", type: "number" },
    ],
    method: TSPlusAPI.volumeActivate,
  },
  {
    id: "update_volume",
    name: "Actualizar Licencia de Volumen",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "users", name: "Usuarios", type: "number" },
    ],
    method: TSPlusAPI.updateVolume,
  },
  {
    id: "update",
    name: "Actualizar TSplus",
    params: [],
    method: TSPlusAPI.update,
  },
  {
    id: "audit",
    name: "Correr una Auditoria de sistema",
    params: [],
    method: TSPlusAPI.audit,
  },
  {
    id: "backup_data",
    name: "Backup",
    params: [{ id: "users", name: "Usuarios", type: "text" }],
    method: TSPlusAPI.backupData,
  },
  {
    id: "license_credits",
    name: "Desplegar creditos de licencia disponible para la llave de licencia",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "users", name: "Usuarios", type: "number" },
      { id: "edition", name: "Edición", type: "text" },
    ],
    method: TSPlusAPI.licenseCredits,
  },
  {
    id: "support_credits",
    name: "Desplegar creditos de soporte disponibles para la llave de licencia de volumen",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "users", name: "Usuarios", type: "number" },
      { id: "edition", name: "Edición", type: "text" },
    ],
    method: TSPlusAPI.supportCredits,
  },
  {
    id: "web_credentials",
    name: "Abrir Formulario Credenciales Web",
    params: [],
    method: TSPlusAPI.getWebCredentials,
  },
  {
    id: "web_credentials_add",
    name: "Crear Credenciales Web",
    params: [
      { id: "webLogin", name: "Login Web", type: "text" },
      { id: "webPassword", name: "Contraseña Web", type: "password" },
      { id: "windowsLogin", name: "Login Windows", type: "text" },
      { id: "windowsPassword", name: "Contraseña Windows", type: "password" },
      {
        id: "maximumCurrentSessions",
        name: "Máximo de Sesiones Actuales",
        type: "number",
      },
    ],
    method: TSPlusAPI.addWebCredentials,
  },
  {
    id: "web_credentials_remove",
    name: "Quitar Credenciales Web",
    params: [{ id: "webLogin", name: "Login Web", type: "text" }],
    method: TSPlusAPI.removeWebCredentials,
  },
  {
    id: "volume_en_dis",
    name: "Habilitar o Deshabilitar Licencia de Volumen",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "option", name: "Opción", type: "text" },
    ],
    method: TSPlusAPI.volumeEnableDisable,
  },
  {
    id: "install_printer",
    name: "Instalar Impresora Universal",
    params: [],
    method: TSPlusAPI.installPrinter,
  },
  {
    id: "load_balancing",
    name: "Abrir Administrador de Balanceo de Carga",
    params: [],
    method: TSPlusAPI.loadBalancing,
  },
  {
    id: "session_monitor",
    name: "Abrir Monitor de Sesiones",
    params: [],
    method: TSPlusAPI.sessionMonitor,
  },
  {
    id: "session_manager",
    name: "Abrir Administrador de Sesiones",
    params: [],
    method: TSPlusAPI.sessionManager,
  },
  {
    id: "proxy",
    name: "Configurar Proxy",
    params: [
      { id: "host", name: "Host", type: "text" },
      { id: "port", name: "Puerto", type: "number" },
      { id: "username", name: "Usuario", type: "text" },
      { id: "password", name: "Contraseña", type: "password" },
    ],
    method: TSPlusAPI.configureProxy,
  },
  {
    id: "remove_printer",
    name: "Remover Impresora Universal",
    params: [],
    method: TSPlusAPI.removePrinter,
  },
  {
    id: "reset_license",
    name: "Resetear Licencia de la siguiente Maquina Virtual Clonada",
    params: [],
    method: TSPlusAPI.resetLicense,
  },
  {
    id: "restore_data",
    name: "Restaurar",
    params: [{ id: "users", name: "Usuarios", type: "text" }],
    method: TSPlusAPI.restoreData,
  },
  {
    id: "webserver",
    name: "Servidor Web",
    params: [{ id: "option", name: "Opción", type: "text" }],
    method: TSPlusAPI.configureWebServer,
  },
  {
    id: "windows_compatibility",
    name: "Aplicar Compatibilidad de Windows",
    params: [],
    method: TSPlusAPI.windowsCompatibility,
  },
];

export default AVAILABLE_COMMANDS;
