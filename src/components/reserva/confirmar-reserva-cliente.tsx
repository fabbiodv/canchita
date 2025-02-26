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

interface ConfirmarReservaClienteProps {
    reservaId: number
    onConfirm: (id: number) => Promise<void>
    disabled?: boolean
}

export function ConfirmarReservaCliente({ reservaId, onConfirm, disabled = false }: ConfirmarReservaClienteProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        try {
            setIsLoading(true)
            await onConfirm(reservaId)
            toast.success("Reserva enviada", {
                description: "Espera a que el centro la acepte",
            })
        } catch (error) {
            toast.error("Error", {
                description: "No se pudo enviar tu reserva",
            })
            console.error("Error al enviar reserva:", error)
        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <Button
                size="sm"
                onClick={() => setOpen(true)}
                disabled={disabled || isLoading}
                className="w-full"
            >
                Reservar
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar reserva</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro que deseas enviar la reserva #{reservaId}?
                            Esta acción no se puede deshacer.
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
                            {isLoading ? "Confirmando..." : "Confirmar reserva"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
