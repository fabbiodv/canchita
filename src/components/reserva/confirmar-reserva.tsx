'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"

interface ConfirmarReservaProps {
    reservaId: number
    onConfirm: (id: number) => Promise<void>
    disabled?: boolean
}

export function ConfirmarReserva({ reservaId, onConfirm, disabled = false }: ConfirmarReservaProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        try {
            setIsLoading(true)
            await onConfirm(reservaId)
            toast.success("Reserva confirmada", {
                description: "Se ha enviado email al cliente",
            })
        } catch (error) {
            toast.error("Error", {
                description: "No se pudo confirmar la reserva",
            })
            console.error("Error al confirmar la reserva:", error)
        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                disabled={disabled || isLoading}
            >
                Confirmar
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción confirmará la reserva #{reservaId} y notificará al cliente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleConfirm()
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Confirmando..." : "Confirmar Reserva"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
