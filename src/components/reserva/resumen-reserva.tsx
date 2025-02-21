'use client'

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createBooking } from "@/utils/bookings"

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

  const handleReservar = async () => {
    // Verificar si el usuario está autenticado
    if (!user) {
      toast.error('Debes iniciar sesión para realizar una reserva')
      router.push('/login')
      return
    }

    try {
      await createBooking(fieldId, fecha, hora, horaFin, precio)
      toast.success('Reserva creada correctamente')
      router.push('/profile/bookings')
    } catch (error) {
      console.error('Error al procesar la reserva:', error)
      toast.error('Error al procesar la reserva')
    }
  }

  return (
    <Card className='p-6 space-y-4 h-fit mt-8'>
      <h2 className="text-xl font-semibold text-gray-800">
        Resumen de Reserva
      </h2>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-600">Dirección:</span>
          <span className="font-medium">{address}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Cancha:</span>
          <span className="font-medium">{cancha}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Fecha:</span>
          <span className="font-medium">{fecha}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Hora:</span>
          <span className="font-medium">{hora}</span>
        </p>
        {precio > 0 && (
          <p className="flex justify-between">
            <span className="text-gray-600">Precio:</span>
            <span className="font-medium">${precio}</span>
          </p>
        )}
      </div>

      <Button
        className="w-full bg-[#009ee3] hover:bg-[#008ed0] text-white"
        size="lg"
        onClick={handleReservar}
        disabled={isDisabled}
      >
        {!user ? 'Inicia sesión para reservar' : 'Reservar'}
      </Button>
    </Card>
  )
}

export default ResumenReserva
