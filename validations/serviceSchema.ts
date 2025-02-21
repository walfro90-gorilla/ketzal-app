import { time } from "console";
import { Itim } from "next/font/google";
import { z } from "zod";

export const serviceSchema = z.object({
  name: z
    .string()
    .nonempty("El nombre del servicio es obligatorio")
    .max(100, "El nombre no debe superar los 100 caracteres"),
  description: z
    .string()
    .nonempty("La descripcion del servicio es obligatorio")
    .max(500, "La descripción no debe superar los 500 caracteres"),
  price: z
    .number()
    .positive("El precio debe ser un número positivo"),
  location: z
    .string()
    .nonempty("La ubicación es obligatoria")
    .max(200, "La ubicación no debe superar los 200 caracteres"),
  availableFrom: z
    .date({ message: "La fecha debe tener un formato válido (ISO 8601)" }),
  availableTo: z
    .date({ message: "La fecha debe tener un formato válido (ISO 8601)" }),
  packs: z.object({
    data: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        qty: z.number(),
        price: z.number(),
      })
    ).nonempty("Debe haber al menos un paquete"),
  }),
  images: z.object({
    imgBanner: z
      .string()
      .nonempty("El imgBanner es obligatorio")
      .url("El imgBanner debe ser una URL válida"),
    imgAlbum: z
      .array(z.string().url("Cada imagen del álbum debe ser una URL válida"))
      .min(4, { message: "El álbum debe tener al menos 4 imágenes." }),
  }),
  ytLink: z
    .string()
    .url("El enlace de YouTube debe ser una URL válida")
    .max(100, "El enlace de YouTube no debe superar los 100 caracteres")
    .optional()
    .or(z.literal('')),
  sizeTour: z
    .number()
    .positive("El tamaño del tour debe ser un número positivo"),
  serviceType: z
    .string()
    .nonempty("El tipo de servicio es obligatorio"),
  serviceCategory: z
    .string()
    .nonempty("La categoría de servicio es obligatoria"),
  stateFrom: z
    .string()
    .nonempty("El estado de origen es obligatorio"),
  cityFrom: z
    .string()
    .nonempty("La ciudad de origen es obligatoria"),
  stateTo: z
    .string()
    .nonempty("El estado de origen es obligatorio"),
  cityTo: z
    .string()
    .nonempty("La ciudad de origen es obligatoria"),
  includes: z
    .array(z.string()).nonempty("Debe haber al menos un elemento en 'includes'"),
  excludes: z
    .array(z.string()).nonempty("Debe haber al menos un elemento en 'Not includes'"),

  faqs: z.array(
    z.object({
      id: z.string(),
      question: z
        .string()
        .nonempty("La pregunta es obligatoria")
        .max(200, "La pregunta no debe superar los 200 caracteres"),
      answer: z
        .string()
        .nonempty("La respuesta es obligatoria")
        .max(500, "La respuesta no debe superar los 500 caracteres"),
    })
  ).nonempty("Debe haber al menos una pregunta en las FAQs"), // Se requiere al menos una FAQ
  
  itinerary: z.array(
    z.object({
      id: z.number() ,
      time: z.string().nonempty("La hora es obligatoria"),
      date: z
        .string()
        .nonempty("El día es obligatorio")
        .max(100, "El día no debe superar los 100 caracteres"),
      description: z
        .string()
        .nonempty("La descripción es obligatoria")
        .max(500, "La descripción no debe superar los 500 caracteres"),
      location: z
        .string()
        .nonempty("La ubicación es obligatoria")
        .max(200, "La ubicación no debe superar los 200 caracteres"),
    })
  ).nonempty("Debe haber al menos un elemento en 'Itinerary'"), // Se requiere al menos un elemento en Itinerary
});
