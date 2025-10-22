import TSPlusAPI from "@/services/ts-plus";
import type { CommandDefinition } from "@/types/command.types";
import {
  volumeEnableDisableSchema,
  volumeInstallSchema,
} from "@/schemas/ts-plusCommandsSchema";

const AVAILABLE_COMMANDS: CommandDefinition[] = [
  // === 2FA ===
  // {
  //   id: "2FA_Add_Groups",
  //   name: "2FA - Añadir Grupo",
  //   description: "Comando para añadir varios grupos de 2FA.",
  //   params: [{ id: "group", name: "Grupo", type: "text" }],
  //   method: TSPlusAPI.add2FAGroups,
  // },
  // {
  //   id: "2FA_Add_Users",
  //   name: "2FA - Añadir users",
  //   description: "Comando para añadir varios usuarios de 2FA.",
  //   params: [
  //     { id: "domainName", name: "Nombre de Dominio", type: "text" },
  //     { id: "receivedMethod", name: "Método de Recepción", type: "text" },
  //     { id: "mobilePhone", name: "Teléfono Móvil", type: "text" },
  //     { id: "email", name: "Email", type: "email" },
  //   ],
  //   method: TSPlusAPI.add2FAUsers,
  // },
  // {
  //   id: "2FA_List_Users",
  //   name: "2FA - Listar Usuarios",
  //   description:
  //     "Comando para obtener una lista de todos los usuarios/grupos configurados en la consola de administración de 2FA.",
  //   params: [],
  //   method: TSPlusAPI.list2FAUsers,
  // },
  // {
  //   id: "2FA_Reset",
  //   name: "2FA - Resetear Usuario",
  //   description: "Comando para resetear usuarios de 2FA.",
  //   params: [{ id: "user", name: "Usuario", type: "text" }],
  //   method: TSPlusAPI.reset2FA,
  // },

  // === Licencias ===
  // {
  //   id: "activate",
  //   name: "Activación de licencia",
  //   description:
  //     "Comando para activar la licencia de Remote Access usando un archivo de licencia.",
  //   params: [{ id: "licensePath", name: "Ruta de Licencia", type: "text" }],
  //   method: TSPlusAPI.activate,
  // },
  {
    id: "download_ts_plus",
    name: "Descargar TS Plus",
    description: "Comando para descargar TS Plus.",
    params: [],
    method: TSPlusAPI.downloadTSPlus,
  },
  {
    id: "install_volume_license_server",
    name: "Instalar Servidor de Licencias por Volumen",
    description:
      "Comando para instalar un servidor de licencias por volumen en un solo paso.",
    params: [
      {
        id: "licenseKey",
        name: "Clave de Licencia",
        type: "text",
        placeholder: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      },
      {
        id: "users",
        name: "Número de Usuarios",
        type: "number",
        placeholder: "10",
      },
      {
        id: "edition",
        name: "Edición",
        type: "select",
        selectOptions: [
          { id: "Enterprise", value: "Enterprise" },
          { id: "Standard", value: "Standard" },
          { id: "Advanced", value: "Advanced" },
        ],
        placeholder: "Enterprise",
      },
      {
        id: "supportYears",
        name: "Años de Soporte",
        type: "number",
        placeholder: "1",
      },
    ],
    // * We will need the next paramaters later (We just need above for testing)
    // {
    //   id: "activatesecurityaddon",
    //   name: "Paquete de Seguridad",
    //   type: "select",
    //   selectOptions: [
    //     { id: "Basic", value: "Basic" },
    //     { id: "Standard", value: "Standard" },
    //     { id: "Advanced", value: "Advanced" },
    //     { id: "Ultimate", value: "Ultimate" },
    //   ],
    // },
    // {
    //   id: "comments",
    //   name: "Comentarios",
    //   type: "text",
    // },
    schema: volumeInstallSchema,
    method: TSPlusAPI.installVolumeLicenseServer,
  },
  {
    id: "volume_act",
    name: "Activar Licencia de Volumen",
    description: "Comando para activar una licencia por volumen.",
    params: [
      {
        id: "license",
        name: "Licencia",
        type: "text",
        placeholder: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      },
    ],
    schema: volumeEnableDisableSchema,
    method: TSPlusAPI.volumeEnable,
  },
  {
    id: "volume_en_dis",
    name: "Deshabilitar Licencia de Volumen",
    description: "Comando para deshabilitar una licencia por volumen.",
    params: [
      {
        id: "license",
        name: "Licencia",
        type: "text",
        placeholder: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      },
    ],
    schema: volumeEnableDisableSchema,
    method: TSPlusAPI.volumeDisable,
  },
  // {
  //   id: "update_volume",
  //   name: "Actualizar Licencia de Volumen",
  //   description:
  //     "Comando para actualizar los usuarios de una licencia por volumen.",
  //   params: [
  //     { id: "license", name: "Licencia", type: "text" },
  //     { id: "users", name: "Usuarios", type: "number" },
  //   ],
  //   schema: volumeUpdateSchema,
  //   method: TSPlusAPI.updateVolume,
  // },
  // {
  //   id: "license_credits",
  //   name: "Desplegar creditos de licencia disponible para la llave de licencia",
  //   description:
  //     "Comando para mostrar los créditos de licencia restantes asociados con una clave de licencia por volumen.",
  //   params: [
  //     { id: "license", name: "Licencia", type: "text" },
  //     { id: "edition", name: "Edición", type: "text" },
  //     { id: "login", name: "Usuario", type: "text" },
  //   ],
  //   method: TSPlusAPI.licenseCredits,
  // },
  // {
  //   id: "support_credits",
  //   name: "Desplegar creditos de soporte disponibles para la llave de licencia de volumen",
  //   description:
  //     "Comando para mostrar los créditos de soporte restantes asociados con una clave de licencia por volumen.",
  //   params: [
  //     { id: "license", name: "Licencia", type: "text" },
  //     { id: "edition", name: "Edición", type: "text" },
  //     { id: "login", name: "Usuario", type: "text" },
  //   ],
  //   method: TSPlusAPI.supportCredits,
  // },
  // {
  //   id: "reset_license",
  //   name: "Resetear Licencia de la siguiente Maquina Virtual Clonada",
  //   description:
  //     "Comando para inicializar las licencias en un servidor clonado.",
  //   params: [],
  //   method: TSPlusAPI.resetLicense,
  // },

  // // === Web Credentials ===
  // {
  //   id: "web_credentials",
  //   name: "Abrir Formulario Credenciales Web",
  //   description: "Comando para abrir la interfaz de Credenciales Web.",
  //   params: [],
  //   method: TSPlusAPI.getWebCredentials,
  // },
  // {
  //   id: "web_credentials_add",
  //   name: "Crear Credenciales Web",
  //   description: "Comando para crear Credenciales Web.",
  //   params: [
  //     { id: "webLogin", name: "Login Web", type: "text" },
  //     { id: "webPassword", name: "Contraseña Web", type: "password" },
  //     { id: "windowsLogin", name: "Login Windows", type: "text" },
  //     { id: "windowsPassword", name: "Contraseña Windows", type: "password" },
  //     {
  //       id: "maximumCurrentSessions",
  //       name: "Máximo de Sesiones Actuales",
  //       type: "number",
  //     },
  //   ],
  //   method: TSPlusAPI.addWebCredentials,
  // },
  // {
  //   id: "web_credentials_remove",
  //   name: "Quitar Credenciales Web",
  //   description: "Comando para eliminar una Credencial Web existente.",
  //   params: [{ id: "webLogin", name: "Login Web", type: "text" }],
  //   method: TSPlusAPI.removeWebCredentials,
  // },

  // // === Backup / Restore ===
  // {
  //   id: "backup_data",
  //   name: "Backup",
  //   description:
  //     "Comando para hacer una copia de seguridad de los datos y configuraciones de TSplus.",
  //   params: [{ id: "users", name: "Usuarios", type: "text" }],
  //   method: TSPlusAPI.backupData,
  // },
  // {
  //   id: "restore_data",
  //   name: "Restaurar",
  //   description: "Comando para restaurar datos y configuraciones de TSplus.",
  //   params: [{ id: "users", name: "Usuarios", type: "text" }],
  //   method: TSPlusAPI.restoreData,
  // },

  // // === Sistema / Utilidades ===
  // {
  //   id: "audit",
  //   name: "Correr una Auditoria de sistema",
  //   description: "Comando para ejecutar una auditoría del sistema.",
  //   params: [],
  //   method: TSPlusAPI.audit,
  // },
  // {
  //   id: "update",
  //   name: "Actualizar TSplus",
  //   description:
  //     "Comando para actualizar TSplus Remote Access y Advanced Security.",
  //   params: [],
  //   method: TSPlusAPI.update,
  // },
  // {
  //   id: "windows_compatibility",
  //   name: "Aplicar Compatibilidad de Windows",
  //   description:
  //     "Comando para aplicar actualizaciones de compatibilidad de Windows.",
  //   params: [],
  //   method: TSPlusAPI.windowsCompatibility,
  // },

  // // === Impresoras ===
  // {
  //   id: "install_printer",
  //   name: "Instalar Impresora Universal",
  //   description: "Comando para instalar la Impresora Universal.",
  //   params: [],
  //   method: TSPlusAPI.installPrinter,
  // },
  // {
  //   id: "remove_printer",
  //   name: "Remover Impresora Universal",
  //   description: "Comando para desinstalar la Impresora Universal.",
  //   params: [],
  //   method: TSPlusAPI.removePrinter,
  // },

  // // === Administración de sesiones y granjas ===
  // {
  //   id: "load_balancing",
  //   name: "Abrir Administrador de Balanceo de Carga",
  //   description:
  //     "Comando para abrir el administrador de balanceo de carga del administrador de granjas.",
  //   params: [],
  //   method: TSPlusAPI.loadBalancing,
  // },
  // {
  //   id: "session_monitor",
  //   name: "Abrir Monitor de Sesiones",
  //   description:
  //     "Comando para abrir el monitor de sesiones del administrador de granjas.",
  //   params: [],
  //   method: TSPlusAPI.sessionMonitor,
  // },
  // {
  //   id: "session_manager",
  //   name: "Abrir Administrador de Sesiones",
  //   description: "Comando para abrir el administrador de sesiones.",
  //   params: [],
  //   method: TSPlusAPI.sessionManager,
  // },

  // // === Red / Proxy / Web Server ===
  // {
  //   id: "proxy",
  //   name: "Configurar Proxy",
  //   description:
  //     "Comando para configurar un servidor proxy para el acceso a Internet.",
  //   params: [
  //     { id: "host", name: "Host", type: "text" },
  //     { id: "port", name: "Puerto", type: "number" },
  //     { id: "username", name: "Usuario", type: "text" },
  //     { id: "password", name: "Contraseña", type: "password" },
  //   ],
  //   method: TSPlusAPI.configureProxy,
  // },
  // {
  //   id: "webserver",
  //   name: "Servidor Web",
  //   description:
  //     "Comandos para controlar el servidor web (detener, iniciar, reiniciar).",
  //   params: [{ id: "option", name: "Opción", type: "text" }],
  //   method: TSPlusAPI.configureWebServer,
  // },
];

export default AVAILABLE_COMMANDS;
