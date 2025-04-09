import { object, string } from "zod"

export const signInSchema = object({
  email: string({ required_error: "Email es requerido" })
    .min(1, "Email es requerido")
    .email("Email invalido"),
  password: string({ required_error: "Contraseña requerida" })
    .min(1, "Contraseña requerida")
    .min(8, "Contraseña debe tener almneos 8 caracteres")
    .max(32, "Contraseña debe tener menos de 32 caractres"),
})

export const signUpSchema = object({
  email: string({ required_error: "Email es requerido" })
    .min(1, "Email es requerido")
    .email("Email invalido"),
  password: string({ required_error: "Contraseña requerida" })
    .min(1, "Contraseña requerida")
    .min(8, "Contraseña debe tener almneos 8 caracteres")
    .max(32, "Contraseña debe tener menos de 32 caractres"),
  confirmPassword: string({ required_error: "Confirmacion de Contraseña requerida" })
    .min(1, "Confirmacion de Contraseña requerida")
    .min(8, "Confirmacion de Contraseña debe tener almneos 8 caracteres")
    .max(32, "Confirmacion de Contraseña debe tener menos de 32 caractres"),
  name: string({ required_error: "Nombre de usuario es obligatorio." })
    .min(1, "Nombre de usuario es obligatorio.")
    .max(32, "Username must be less than 32 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "La contraseña no es valida",
  path: ["confirmPassword"],
})