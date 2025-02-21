'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Center } from "@/types/center"
import { createCenter } from "@/utils/centers"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"

interface CreateCenterDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateSuccess: (newCenter: Center) => void
}

// Definimos el esquema de validación
const centerSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    address: z.string().min(1, "La dirección es requerida"),
    description: z.string().optional(),
    phone: z.string().optional(),
})

type CenterFormData = z.infer<typeof centerSchema>

export function CreateCenterDialog({ open, onOpenChange, onCreateSuccess }: CreateCenterDialogProps) {
    const form = useForm<CenterFormData>({
        resolver: zodResolver(centerSchema),
        defaultValues: {
            name: "",
            address: "",
            description: "",
            phone: "",
        },
    })

    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(data: CenterFormData) {
        try {
            setIsLoading(true)
            console.log(data)
            const newCenter = await createCenter(data as Center)
            onCreateSuccess(newCenter)
            form.reset()
            onOpenChange(false)
            toast.success('Centro deportivo creado correctamente')
        } catch (error) {
            console.error('Error al crear centro:', error)
            toast.error('Error al crear centro deportivo')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Crear centro deportivo</DialogTitle>
                        <DialogDescription>
                            Ingresa los datos del nuevo centro deportivo
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                {...form.register("name")}
                                aria-invalid={!!form.formState.errors.name}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input
                                {...form.register("address")}
                                aria-invalid={!!form.formState.errors.address}
                            />
                            {form.formState.errors.address && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.address.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Input
                                {...form.register("description")}
                                aria-invalid={!!form.formState.errors.description}
                            />
                            {form.formState.errors.description && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.description.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                {...form.register("phone")}
                                aria-invalid={!!form.formState.errors.phone}
                            />
                            {form.formState.errors.phone && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creando...' : 'Crear centro'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}