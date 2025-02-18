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
//import { createCenter } from "@/utils/centers"
import { useState } from "react"

interface CreateCenterDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateSuccess: (newCenter: Center) => void
}


export function CreateCenterDialog({ open, onOpenChange }: CreateCenterDialogProps) {
    const [isLoading, setIsLoading] = useState(false)


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        // Aquí implementarías la lógica para crear el centro
        // const response = await createCenter(formData)
        // onCreateSuccess(response)

        setIsLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Crear centro deportivo</DialogTitle>
                        <DialogDescription>
                            Ingresa los datos del nuevo centro deportivo
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" name="name" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input id="address" name="address" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Input id="description" name="description" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" name="phone" required />
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