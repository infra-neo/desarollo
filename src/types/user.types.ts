export interface UserDataReponse {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string | null;
  foto: string | null;
  guid: string;
  empresa_guid: string;
}

export interface User {
  id: string | number;
  email: string;
  name: string;
  enterpriseGuid: string;
}
