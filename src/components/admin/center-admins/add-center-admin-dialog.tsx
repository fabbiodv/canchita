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
    DialogFooter
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
import { Checkbox } from "@/components/ui/checkbox"
import { createCenterAdmin } from "@/utils/center-admins"
import { getUserByEmail } from "@/utils/users"
import { Center } from "@/types/center"

// Definimos los permisos disponibles
const PERMISSIONS = [
    { id: "FULL_ACCESS", label: "Acceso completo" }
]

// Esquema de validación
const adminSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    centerId: z.string().min(1, "Selecciona un centro deportivo"),
    permissions: z.array(z.string()).min(1, "Selecciona al menos un permiso")
})

type AdminFormData = z.infer<typeof adminSchema>

interface AddCenterAdminDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddSuccess: () => void
    centers: Center[]
}

export function AddCenterAdminDialog({
    open,
    onOpenChange,
    onAddSuccess,
    centers
}: AddCenterAdminDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<AdminFormData>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
            email: "",
            centerId: "",
            permissions: []
        }
    })

    // Verificar si el acceso completo está seleccionado
    const hasFullAccess = form.watch("permissions")?.includes("FULL_ACCESS")

    // Función para manejar la selección de "Acceso completo"
    const handleFullAccessChange = (checked: boolean) => {
        if (checked) {
            // Si se selecciona "Acceso completo", establecer solo ese permiso
            form.setValue("permissions", ["FULL_ACCESS"])
        } else {
            // Si se deselecciona, limpiar los permisos
            form.setValue("permissions", [])
        }
    }

    async function onSubmit(data: AdminFormData) {
        try {
            setIsLoading(true)

            // Buscar el usuario por email primero
            const user = await getUserByEmail(data.email)

            if (!user) {
                throw new Error('Usuario no encontrado')
            }

            // Agregar el usuario como administrador
            const response = await createCenterAdmin(Number(data.centerId), user.id, data.permissions)

            if (!response) {
                throw new Error('Error al agregar administrador')
            }

            toast.success('Administrador agregado correctamente')
            form.reset()
            onOpenChange(false)
            onAddSuccess()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al agregar administrador')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar administrador</DialogTitle>
                    <DialogDescription>
                        Agrega un usuario como administrador de este centro deportivo
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico del usuario</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="usuario@ejemplo.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="permissions"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>Permisos</FormLabel>
                                    </div>
                                    <div className="space-y-2">
                                        {PERMISSIONS.map((permission) => (
                                            <FormField
                                                key={permission.id}
                                                control={form.control}
                                                name="permissions"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={permission.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(permission.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        if (permission.id === "FULL_ACCESS") {
                                                                            handleFullAccessChange(!!checked)
                                                                        } else {
                                                                            const updatedPermissions = checked
                                                                                ? [...field.value, permission.id]
                                                                                : field.value?.filter(
                                                                                    (value) => value !== permission.id
                                                                                )
                                                                            field.onChange(updatedPermissions)
                                                                        }
                                                                    }}
                                                                    disabled={permission.id !== "FULL_ACCESS" && hasFullAccess}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className={`font-normal ${permission.id !== "FULL_ACCESS" && hasFullAccess ? "text-gray-400" : ""}`}>
                                                                {permission.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Agregando..." : "Agregar administrador"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
