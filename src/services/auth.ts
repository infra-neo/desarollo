import type { CheckAuthResponse } from "@/types/auth.types";
import { addLocalUser, findLocalUser } from "@/data/users";
import api from "../utils/api";

class Auth {
  static async login(email: string, password: string): Promise<void> {
    // First, try to authenticate with the backend API
    try {
      const response = await api.post("/auth", {
        correo: email,
        contrasena: password,
      });
      return response.data;
    } catch (error) {
      // If API fails, check local users as fallback
      const localUser = findLocalUser(email, password);
      if (localUser) {
        // Simulate successful API response for local users
        return Promise.resolve();
      }
      // Re-throw the error if not found locally either
      throw error;
    }
  }

  static async register(name: string, email: string, password: string): Promise<void> {
    // Add user to local storage
    addLocalUser({
      name,
      email,
      password,
    });
    return Promise.resolve();
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
