import type { CheckAuthResponse } from "@/types/auth.types";
import api from "../utils/api";

class Auth {
  static async login(email: string, password: string): Promise<void> {
    const response = await api.post("/auth", {
      correo: email,
      contrasena: password,
    });
    return response.data;
  }

  static async logout() {
    const response = await api.delete("/auth");
    return response.data;
  }

  static async refreshToken() {
    const response = await api.put("/auth");
    return response.data;
  }

  static async checkAuth() {
    const response = await api.get<CheckAuthResponse>("/auth/check");
    return response.data;
  }
}

export default Auth;
