import type { CheckAuthResponse } from "@/types/auth.types";
import { addLocalUser, findLocalUser } from "@/data/users";
import api from "../utils/api";

class Auth {
  static async login(email: string, password: string): Promise<void> {
    // Check local users first (for offline/local mode)
    const localUser = findLocalUser(email, password);
    if (localUser) {
      // User found locally, return success
      return Promise.resolve();
    }
    
    // If not found locally and API is configured, try backend
    if (import.meta.env.VITE_URL_API) {
      try {
        const response = await api.post("/auth", {
          correo: email,
          contrasena: password,
        });
        return response.data;
      } catch (error) {
        // Backend failed and no local user found
        throw new Error("Credenciales incorrectas");
      }
    }
    
    // No local user and no backend configured
    throw new Error("Usuario no encontrado. Regístrese primero.");
  }

  static async register(name: string, email: string, password: string): Promise<any> {
    // Check if user already exists locally
    const existingUser = findLocalUser(email, "");
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }
    
    // Add user to local storage and generate an enterprise GUID
    const newUser = addLocalUser({
      name,
      email,
      password,
      enterpriseGuid: crypto.randomUUID(),
    });

    // If backend API is configured, try to register there too
    if (import.meta.env.VITE_URL_API) {
      try {
        await api.post("/auth/register", {
          nombre: name,
          correo: email,
          contrasena: password,
        });
      } catch (error) {
        // Backend registration failed, but local registration succeeded
        console.warn("Backend registration failed, using local only:", error);
      }
    }

    return Promise.resolve(newUser);
  }

  static async logout() {
    // Try backend logout if API is configured
    if (import.meta.env.VITE_URL_API) {
      try {
        const response = await api.delete("/auth");
        return response.data;
      } catch (error) {
        console.warn("Backend logout failed:", error);
      }
    }
    // Always succeed logout (clear local state)
    return Promise.resolve();
  }

  static async refreshToken() {
    // Only try refresh if backend API is configured
    if (import.meta.env.VITE_URL_API) {
      try {
        const response = await api.put("/auth");
        return response.data;
      } catch (error) {
        console.warn("Token refresh failed:", error);
        return null;
      }
    }
    return null;
  }

  static async checkAuth(): Promise<CheckAuthResponse> {
    // If backend API is configured, check with backend
    if (import.meta.env.VITE_URL_API) {
      try {
        const response = await api.get<CheckAuthResponse>("/auth/check");
        return response.data;
      } catch (error) {
        console.warn("Backend auth check failed:", error);
      }
    }
    
    // Return not authenticated (will fall back to local storage in AuthContext)
    return { authenticated: false };
  }
}

export default Auth;
