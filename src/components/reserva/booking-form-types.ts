import { z } from "zod"

// Esquema de validación para el formulario
export const bookingFormSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").optional(),
    lastName: z.string().min(1, "El apellido es requerido").optional(),
    dni: z.string().min(7, "El DNI debe tener al menos 7 dígitos").optional(),
    phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos").optional(),
    paymentMethod: z.enum(["cash"], {
        required_error: "El método de pago es requerido",
    }),
})

export type BookingFormValues = z.infer<typeof bookingFormSchema> 