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

  static async register(name: string, email: string, password: string): Promise<any> {
    // Add user to local storage and generate an enterprise GUID so
    // downstream flows (e.g. creating server groups) have a valid value.
    const newUser = addLocalUser({
      name,
      email,
      password,
      // generate a default enterprise guid for local users
      enterpriseGuid: crypto.randomUUID(),
    });

    // Return the created user so callers can use it if needed
    return Promise.resolve(newUser);
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
