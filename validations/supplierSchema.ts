import { z } from 'zod';

const types = ["agencia_tours", "agencia_local", "traslados", "guia", "hotel"] as const;

export type Types = typeof types[number];

export const mappedTypes: {
    [key in Types]: string;
} = {
    agencia_tours: "Agencia Tours",
    agencia_local: "Agencia Local",
    traslados: "Traslados y rentas",
    guia: "Guia",
    hotel: "Hotel"
}

export const supplierSchema = z.object({
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
            message: "Número de teléfono debe tener 10 dígitos y solo contener números sin espacios"
        }),
    address: z
        .string()
        .min(3, {
            message: "Dirección muy corta"
        }).max(255, {
            message: "Dirección muy larga"
        }),


    type: z.enum(types, {
        errorMap: () => ({ message: "Seleccione un tipo" })
    }),

    imgLogo: z
        .string()
        .url({
            message: "URL de imagen inválida"
        })
});
