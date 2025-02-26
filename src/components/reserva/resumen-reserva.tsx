'use client'

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createBooking } from "@/utils/bookings"
import { ConfirmarReservaCliente } from "@/components/reserva/confirmar-reserva-cliente"

interface ResumenReservaProps {
  address?: string
  cancha?: string
  fecha?: string
  hora?: string
  fieldId?: number
  horaFin?: string
  precio?: number
}

const ResumenReserva = ({
  address,
  cancha = 'Sin seleccionar',
  fecha = 'Sin seleccionar',
  hora = 'Sin seleccionar',
  fieldId = 0,
  horaFin = '',
  precio = 0
}: ResumenReservaProps) => {
  const { user } = useAuth()
  const router = useRouter()

  const isDisabled = !cancha || !fecha || !hora || !fieldId

  const handleConfirmReserva = async () => {
    return createBooking(fieldId, fecha, hora, horaFin, precio)
      .then(() => {
        router.push('/profile/bookings')
      })
  }

  const handleReservar = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar una reserva')
      router.push('/login')
      return
    }
  }

  return (
    <Card className='p-6 space-y-4 h-fit mt-8'>
      <h2 className="text-xl font-semibold">
        Resumen de Reserva
      </h2>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span>Dirección:</span>
          <span className="font-medium">{address}</span>
        </p>
        <p className="flex justify-between">
          <span>Cancha:</span>
          <span className="font-medium">{cancha}</span>
        </p>
        <p className="flex justify-between">
          <span>Fecha:</span>
          <span className="font-medium">{fecha}</span>
        </p>
        <p className="flex justify-between">
          <span>Hora:</span>
          <span className="font-medium">{hora}</span>
        </p>
        {precio > 0 && (
          <p className="flex justify-between">
            <span>Precio:</span>
            <span className="font-medium">${precio}</span>
          </p>
        )}
      </div>

      <div className="space-y-4">
        {!user ? (
          <Button
            className="w-full"
            size="lg"
            onClick={handleReservar}
            disabled={isDisabled}
          >
            Inicia sesión para reservar
          </Button>
        ) : (
          <ConfirmarReservaCliente
            reservaId={fieldId}
            onConfirm={handleConfirmReserva}
            disabled={isDisabled}
          />
        )}
      </div>
    </Card>
  )
}

export default ResumenReserva
