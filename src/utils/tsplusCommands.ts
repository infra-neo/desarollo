import TSPlusAPI from "@/services/ts-plus";
import type { CommandDefinition } from "@/types/command.types";

const AVAILABLE_COMMANDS: CommandDefinition[] = [
  {
    id: "volume_en_dis",
    name: "Habilitar/Deshabilitar Volumen",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "option", name: "Opción", type: "text" },
    ],
    method: TSPlusAPI.volumeEnableDisable,
  },
  {
    id: "volume_act",
    name: "Activar Volumen",
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
    name: "Actualizar Volumen",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "users", name: "Usuarios", type: "number" },
    ],
    method: TSPlusAPI.updateVolume,
  },
  {
    id: "2FA_Reset",
    name: "Resetear 2FA",
    params: [{ id: "user", name: "Usuario", type: "text" }],
    method: TSPlusAPI.reset2FA,
  },
  {
    id: "2FA_Add_Users",
    name: "Añadir Usuarios a 2FA",
    params: [
      { id: "domainName", name: "Nombre de Dominio", type: "text" },
      { id: "receivedMethod", name: "Método de Recepción", type: "text" },
      { id: "mobilePhone", name: "Teléfono Móvil", type: "text" },
      { id: "email", name: "Email", type: "email" },
    ],
    method: TSPlusAPI.add2FAUsers,
  },
  {
    id: "2FA_Add_Groups",
    name: "Añadir Grupos a 2FA",
    params: [{ id: "group", name: "Grupo", type: "text" }],
    method: TSPlusAPI.add2FAGroups,
  },
  {
    id: "2FA_List_Users",
    name: "Listar Usuarios 2FA",
    params: [],
    method: TSPlusAPI.list2FAUsers,
  },
  {
    id: "license_credits",
    name: "Créditos de Licencia",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "users", name: "Usuarios", type: "number" },
      { id: "edition", name: "Edición", type: "text" },
    ],
    method: TSPlusAPI.licenseCredits,
  },
  {
    id: "support_credits",
    name: "Créditos de Soporte",
    params: [
      { id: "license", name: "Licencia", type: "text" },
      { id: "users", name: "Usuarios", type: "number" },
      { id: "edition", name: "Edición", type: "text" },
    ],
    method: TSPlusAPI.supportCredits,
  },
  {
    id: "reset_license",
    name: "Resetear Licencia",
    params: [],
    method: TSPlusAPI.resetLicense,
  },
  {
    id: "activate",
    name: "Activar licencia",
    params: [{ id: "licensePath", name: "Ruta de Licencia", type: "text" }],
    method: TSPlusAPI.activate,
  },
  {
    id: "web_credentials",
    name: "Credenciales Web",
    params: [],
    method: TSPlusAPI.getWebCredentials,
  },
  {
    id: "audit",
    name: "Auditoría",
    params: [],
    method: TSPlusAPI.audit,
  },
  {
    id: "load_balancing",
    name: "Balanceo de Carga",
    params: [],
    method: TSPlusAPI.loadBalancing,
  },
  {
    id: "session_monitor",
    name: "Monitor de Sesión",
    params: [],
    method: TSPlusAPI.sessionMonitor,
  },
  {
    id: "session_manager",
    name: "Gestor de Sesión",
    params: [],
    method: TSPlusAPI.sessionManager,
  },
  {
    id: "web_credentials_add",
    name: "Añadir Credenciales Web",
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
    name: "Eliminar Credenciales Web",
    params: [{ id: "webLogin", name: "Login Web", type: "text" }],
    method: TSPlusAPI.removeWebCredentials,
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
    id: "webserver",
    name: "Servidor Web",
    params: [{ id: "option", name: "Opción", type: "text" }],
    method: TSPlusAPI.configureWebServer,
  },
  {
    id: "backup_data",
    name: "Backup de Datos",
    params: [{ id: "users", name: "Usuarios", type: "text" }],
    method: TSPlusAPI.backupData,
  },
  {
    id: "restore_data",
    name: "Restaurar Datos",
    params: [{ id: "users", name: "Usuarios", type: "text" }],
    method: TSPlusAPI.restoreData,
  },
  {
    id: "update",
    name: "Actualizar",
    params: [],
    method: TSPlusAPI.update,
  },
  {
    id: "windows_compatibility",
    name: "Compatibilidad con Windows",
    params: [],
    method: TSPlusAPI.windowsCompatibility,
  },
  {
    id: "install_printer",
    name: "Instalar Impresora",
    params: [],
    method: TSPlusAPI.installPrinter,
  },
  {
    id: "remove_printer",
    name: "Eliminar Impresora",
    params: [],
    method: TSPlusAPI.removePrinter,
  },
];

export default AVAILABLE_COMMANDS;
