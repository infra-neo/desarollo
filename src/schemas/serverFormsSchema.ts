import { z } from "zod";

export const serverGroupSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos"
    ),
  descripcion: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(200, "La descripción no puede exceder 200 caracteres"),
});

export const serverSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-Z0-9\s\-_.]+$/,
      "El nombre solo puede contener letras, números, espacios, guiones, puntos y guiones bajos"
    ),
  ip: z
    .string()
    .min(1, "La dirección IP es requerida")
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "Ingresa una dirección IP válida (ej: 192.168.1.1)"
    ),
  tunel: z
    .string()
    .min(1, "El túnel es requerido")
    .min(3, "El túnel debe tener al menos 3 caracteres")
    .max(100, "El túnel no puede exceder 100 caracteres")
    .regex(/^[a-zA-Z0-9\-_.:/]+$/, "El túnel contiene caracteres no válidos"),
  descripcion: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(300, "La descripción no puede exceder 300 caracteres"),
});

export type ServerFormData = z.infer<typeof serverSchema>;

export type ServerGroupFormData = z.infer<typeof serverGroupSchema>;
