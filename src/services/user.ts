import type { UserDataReponse } from "@/types/user.types";
import api from "@/utils/api";
import { formatUser } from "@/utils/formatters/userResponseFormatter";

class User {
  static async getUserData() {
    try {
      const response = await api.get<UserDataReponse>("/users");
      const user = formatUser(response.data);
      return user;
    } catch (error) {
      // If API fails, check if there's a local user session
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const localUserData = JSON.parse(userStr);
        return localUserData;
      }
      throw error;
    }
  }
}

export default User;
