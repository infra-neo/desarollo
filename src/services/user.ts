import type { UserDataReponse } from "@/types/user.types";
import api from "@/utils/api";
import { formatUser } from "@/utils/formatters/userResponseFormatter";

class User {
  static async getUserData() {
    const response = await api.get<UserDataReponse>("/users");
    const user = formatUser(response.data);
    return user;
  }
}

export default User;
