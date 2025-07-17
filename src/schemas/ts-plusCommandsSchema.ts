import { z } from "zod";

export const volumeInstallSchema = z.object({
  licenseKey: z
    .string({ required_error: "El campo es requerido" })
    .min(1, "La licencia es requerida")
    .max(32, "La licencia debe tener un maximo de 32 caracteres"),
  users: z
    .number({ required_error: "El campo es requerido" })
    .int("El numero de usuarios debe ser un numero entero")
    .min(1, "El numero de usuarios debe ser mayor que 0")
    .max(100, "El numero de usuarios no debe ser mayor a 100"),
  edition: z
    .string({ required_error: "El campo es requerido" })
    .min(1, "La edicion es requerida")
    .max(32, "La edicion debe tener un maximo de 32 caracteres"),
  supportYears: z
    .number({ required_error: "El campo es requerido" })
    .int("Los años de soporte deben ser un numero entero")
    .min(1, "Los años de soporte deben ser mayor que 0")
    .max(10, "Los años de soporte no deben ser mayor a 10"),
});

export const volumeActivationSchema = z.object({
  license: z
    .string({ required_error: "El campo es requerido" })
    .min(1, "La licencia es requerida")
    .max(32, "La licencia debe tener un maximo de 32 caracteres"),
  users: z
    .number({ required_error: "El campo es requerido" })
    .int("El numero de usuarios debe ser un numero entero")
    .min(1, "El numero de usuarios debe ser mayor que 0")
    .max(100, "El numero de usuarios no debe ser mayor a 100"),
  edition: z
    .string({ required_error: "El campo es requerido" })
    .min(1, "La edicion es requerida")
    .max(32, "La edicion debe tener un maximo de 32 caracteres"),
  supportYears: z
    .number({ required_error: "El campo es requerido" })
    .int("Los años de soporte deben ser un numero entero")
    .min(1, "Los años de soporte deben ser mayor que 0")
    .max(10, "Los años de soporte no deben ser mayor a 10"),
});

export const volumeEnableDisableSchema = z.object({
  license: z
    .string({ required_error: "El campo es requerido" })
    .min(1, "La licencia es requerida")
    .max(32, "La licencia debe tener un maximo de 32 caracteres"),
});

export const volumeUpdateSchema = z.object({
  license: z
    .string({ required_error: "El campo es requerido" })
    .min(1, "La licencia es requerida")
    .max(32, "La licencia debe tener un maximo de 32 caracteres"),
  users: z
    .number({ required_error: "El campo es requerido" })
    .int("El numero de usuarios debe ser un numero entero")
    .min(1, "El numero de usuarios debe ser mayor que 0")
    .max(100, "El numero de usuarios no debe ser mayor a 100"),
});
