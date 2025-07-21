import { object, string, boolean } from "zod"

export const signInSchema = object({
  email: string({ required_error: "Email es requerido" })
    .min(1, "Email es requerido")
    .email("Email invalido"),
  password: string({ required_error: "Contraseña requerida" })
    .min(1, "Contraseña requerida")
    .min(8, "Contraseña debe tener almneos 8 caracteres")
    .max(32, "Contraseña debe tener menos de 32 caractres"),
})

// Schema para solicitud de reset de contraseña
export const forgotPasswordSchema = object({
  email: string({ required_error: "Email es requerido" })
    .min(1, "Email es requerido")
    .email("Email invalido"),
})

// Schema para reset de contraseña con token
export const resetPasswordSchema = object({
  token: string({ required_error: "Token es requerido" })
    .min(1, "Token es requerido"),
  password: string({ required_error: "Nueva contraseña requerida" })
    .min(1, "Nueva contraseña requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
  confirmPassword: string({ required_error: "Confirmación de contraseña requerida" })
    .min(1, "Confirmación de contraseña requerida")
    .min(8, "Confirmación de contraseña debe tener al menos 8 caracteres")
    .max(32, "Confirmación de contraseña debe tener menos de 32 caracteres"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
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

// Esquema extendido para registro de administradores
export const signUpAdminSchema = object({
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
    .max(32, "El nombre debe tener menos de 32 caracteres"),
  
  // Campos adicionales para administradores
  company: string({ required_error: "Nombre de la empresa es requerido" })
    .min(1, "Nombre de la empresa es requerido")
    .max(100, "El nombre de la empresa debe tener menos de 100 caracteres"),
  serviceType: string({ required_error: "Tipo de servicio es requerido" })
    .min(1, "Tipo de servicio es requerido"),
  city: string({ required_error: "Ciudad es requerida" })
    .min(1, "Ciudad es requerida")
    .max(50, "La ciudad debe tener menos de 50 caracteres"),
  phone: string({ required_error: "Número de teléfono es requerido" })
    .min(10, "El número debe tener al menos 10 dígitos")
    .max(15, "El número debe tener máximo 15 dígitos")
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Formato de teléfono inválido"),
  documentation: string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "La contraseña no es valida",
  path: ["confirmPassword"],
})