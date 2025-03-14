'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field } from "@/types/field"
import { createField } from "@/utils/fields"

const fieldSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    type: z.enum(["FUTBOL_5", "FUTBOL_7", "FUTBOL_11", "PADEL", "TENIS"], {
        required_error: "El tipo de cancha es requerido",
    }),
    surface: z.enum(["SYNTHETIC_GRASS", "NATURAL_GRASS", "HARD_COURT"], {
        required_error: "La superficie es requerida",
    }),
    price: z.string().min(1, "El precio es requerido").transform(Number),
    centerId: z.string().min(1, "El centro deportivo es requerido").transform(Number),
    description: z.string().optional(),
    openTime: z.string().min(1, "La hora de apertura es requerida")
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
    closeTime: z.string().min(1, "La hora de cierre es requerida")
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
    status: z.enum(["ACTIVE", "MAINTENANCE", "INACTIVE"], {
        required_error: "El estado es requerido",
    }),
}).refine((data) => {
    const open = data.openTime.split(':').map(Number);
    const close = data.closeTime.split(':').map(Number);
    const openMinutes = open[0] * 60 + open[1];
    const closeMinutes = close[0] * 60 + close[1];
    return closeMinutes > openMinutes;
}, {
    message: "La hora de cierre debe ser posterior a la hora de apertura",
    path: ["closeTime"],
});

type FieldFormData = z.infer<typeof fieldSchema>

interface CreateFieldDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateSuccess: (field: Field) => void
    centers: Array<{ id: number; name: string }>
    fields: Array<Field>
}

const fieldTypes = {
    FUTBOL_5: "Fútbol 5",
    FUTBOL_7: "Fútbol 7",
    FUTBOL_11: "Fútbol 11",
    PADEL: "Pádel",
    TENIS: "Tenis",
}

const fieldStatus = {
    ACTIVE: "Activa",
    MAINTENANCE: "En mantenimiento",
    INACTIVE: "Inactiva",
}

const surfaceTypes = {
    SYNTHETIC_GRASS: "Césped sintético",
    NATURAL_GRASS: "Césped natural",
    HARD_COURT: "Superficie dura",
}


export function CreateFieldDialog({ open, onOpenChange, onCreateSuccess, centers }: CreateFieldDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<FieldFormData>({
        resolver: zodResolver(fieldSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            openTime: "09:00",
            closeTime: "21:00",
            status: "ACTIVE",
        },
    })

    async function onSubmit(data: FieldFormData) {
        try {
            setIsLoading(true)
            const newField = await createField(data as Field)
            onCreateSuccess(newField)
            form.reset()
            onOpenChange(false)
            toast.success('Cancha creada correctamente')
        } catch (error) {
            console.error('Error al crear cancha:', error)
            toast.error('Error al crear la cancha')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear nueva cancha</DialogTitle>
                    <DialogDescription>
                        Completa los datos para crear una nueva cancha en tu centro deportivo
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="centerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Centro deportivo</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un centro deportivo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {centers.map((center) => (
                                                <SelectItem
                                                    key={center.id}
                                                    value={center.id.toString()}
                                                >
                                                    {center.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese el nombre de la cancha" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de cancha</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(fieldTypes).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="surface"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Superficie</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona la superficie" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(surfaceTypes).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio por hora</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="openTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora de apertura</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="time"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="closeTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hora de cierre</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="time"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(fieldStatus).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción (opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Describe las características de la cancha"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creando..." : "Crear cancha"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
