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
    // .string()
    // .nonempty("La Fecha inicio del servicio es obligatorio"),

    .date({ message: "La fecha debe tener un formato válido (ISO 8601)" }),
    
  availableTo: z

  .date({ message: "La fecha debe tener un formato válido (ISO 8601)" }),
    
    // .nonempty("La fecha llegada del servicio es obligatorio"),
    
    // .datetime({ message: "La fecha debe tener un formato válido (ISO 8601)" }),
    
  
});
