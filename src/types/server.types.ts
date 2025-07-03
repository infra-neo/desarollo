export interface RequestGroupServer {
  nombre: string;
  descripcion: string;
  empresa_guid: string;
}

export interface GroupServer {
  nombre: string;
  descripcion: string;
  empresa_guid: string;
  guid: string;
}

export interface Server {
  ip: string;
  tunel: string;
  nombre: string;
  descripcion: string;
  grupo_guid: string;
  guid: string;
}
