'use client'

import { useState, useEffect } from "react"
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
import { Center } from "@/types/center"
import { updateField } from "@/utils/fields"

const FIELD_TYPES = {
    FUTBOL_5: "Fútbol 5",
    FUTBOL_7: "Fútbol 7",
    FUTBOL_11: "Fútbol 11",
    PADEL: "Pádel",
    TENIS: "Tenis",
} as const

const FIELD_STATUS = {
    ACTIVE: "Activa",
    MAINTENANCE: "En mantenimiento",
    INACTIVE: "Inactiva",
} as const

const SURFACE_TYPES = {
    SYNTHETIC_GRASS: "Césped sintético",
    NATURAL_GRASS: "Césped natural",
    HARD_COURT: "Superficie dura",
} as const

const fieldSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(50, "El nombre es muy largo"),
    type: z.enum(Object.keys(FIELD_TYPES) as [keyof typeof FIELD_TYPES, ...Array<keyof typeof FIELD_TYPES>], {
        required_error: "El tipo de cancha es requerido",
    }),
    surface: z.enum(Object.keys(SURFACE_TYPES) as [keyof typeof SURFACE_TYPES, ...Array<keyof typeof SURFACE_TYPES>], {
        required_error: "La superficie es requerida",
    }),
    price: z.coerce.number().positive("El precio debe ser mayor a 0"),
    centerId: z.coerce.number().positive("El centro deportivo es requerido"),
    description: z.string().optional(),
    openTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
    closeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
    status: z.enum(Object.keys(FIELD_STATUS) as [keyof typeof FIELD_STATUS, ...Array<keyof typeof FIELD_STATUS>], {
        required_error: "El estado es requerido",
    }),
}).refine(({ openTime, closeTime }) => {
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    return (closeHour * 60 + closeMinute) > (openHour * 60 + openMinute);
}, {
    message: "La hora de cierre debe ser posterior a la hora de apertura",
    path: ["closeTime"],
});

type FieldFormData = z.infer<typeof fieldSchema>

interface EditFieldDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onEditSuccess: (field: Field) => void
    field: Field | null
    centers: Center[]
}

export function EditFieldDialog({ open, onOpenChange, onEditSuccess, field, centers }: EditFieldDialogProps) {
    const [isPending, setIsPending] = useState(false)

    const form = useForm<FieldFormData>({
        resolver: zodResolver(fieldSchema),
        defaultValues: {
            name: "",
            type: "FUTBOL_5",
            surface: "SYNTHETIC_GRASS",
            price: 0,
            centerId: 0,
            description: "",
            openTime: "00:00",
            closeTime: "23:59",
            status: "ACTIVE"
        }
    })

    useEffect(() => {
        if (field) {
            form.reset({
                name: field.name,
                type: field.type as "FUTBOL_5" | "FUTBOL_7" | "FUTBOL_11" | "PADEL" | "TENIS",
                surface: field.surface as "SYNTHETIC_GRASS" | "NATURAL_GRASS" | "HARD_COURT",
                price: field.price,
                centerId: field.centerId,
                description: field.description ?? "",
                openTime: field.openTime,
                closeTime: field.closeTime,
                status: field.status as "ACTIVE" | "MAINTENANCE" | "INACTIVE",
            })
        }
    }, [field, form])

    async function onSubmit(data: FieldFormData) {
        if (!field) return

        try {
            setIsPending(true)
            const result = await updateField(field.id.toString(), data as Field)
            if (!result.success) {
                toast.error(result.error)
            } else {
                onEditSuccess(result.data)
                onOpenChange(false)
                toast.success('Cancha actualizada correctamente')
            }
        } catch (error) {
            console.error('Error al actualizar cancha:', error)
            toast.error(error instanceof Error ? error.message : 'Error al actualizar la cancha')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar cancha</DialogTitle>
                    <DialogDescription>
                        Modifica los datos de la cancha
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
                                        <Input placeholder="Cancha 1" {...field} />
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
                                            {Object.entries(FIELD_TYPES).map(([value, label]) => (
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
                                            {Object.entries(SURFACE_TYPES).map(([value, label]) => (
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
                                            {Object.entries(FIELD_STATUS).map(([value, label]) => (
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
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                            variant="default"
                        >
                            {isPending ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Guardando...
                                </>
                            ) : (
                                "Guardar cambios"
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
