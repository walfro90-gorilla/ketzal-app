import { z } from 'zod';

const supplierSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: "Nombre muy corto"
        }).max(255, {
            message: "Nombre muy largo"
        }),
    description: z
        .string()
        .min(3, {
            message: "Descripción muy corta"
        }).max(255, {
            message: "Descripción muy larga"
        }),
    contactEmail: z
        .string()
        .email({
            message: "Correo electrónico inválido"
        }),
    phoneNumber: z
        .string()
        .regex(/^\d{10}$/, {
            message: "Número de teléfono debe tener 10 dígitos y solo contener números"
        }),
    address: z
        .string()
        .min(3, {
            message: "Dirección muy corta"
        }).max(255, {
            message: "Dirección muy larga"
        }),
    id: z
        .string()
        .uuid({
            message: "ID inválido"
        }),
    imgLogo: z
        .string()
        .url({
            message: "URL de imagen inválida"
        })
});
