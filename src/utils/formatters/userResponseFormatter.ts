import type { User } from "@/types/user.types";
import type { UserDataReponse } from "@/types/user.types";

export const formatUser = (user: UserDataReponse): User => {
  return {
    id: user.guid,
    email: user.correo,
    name: user.nombre,
  };
};
