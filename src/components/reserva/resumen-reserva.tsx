'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { createBooking } from "@/utils/bookings"

interface ResumenReservaProps {
  address?: string
  cancha?: string
  fecha?: string
  hora?: string
  precio?: number
  fieldId?: number
  horaFin?: string
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

  const isDisabled = !cancha || !fecha || !hora || !fieldId;

  const handleReservar = async () => {
    console.log(fieldId, fecha, hora, horaFin, precio)
    try {
      const data = await createBooking(fieldId, fecha, hora, horaFin, precio)
      console.log(data)
      toast.success('Reserva creada correctamente');
    } catch (error) {
      console.error('Error al procesar la reserva:', error)
      toast.error('Error al procesar la reserva');
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

      </div>

      <Button
        className="w-full bg-[#009ee3] hover:bg-[#008ed0] text-white"
        size="lg"
        onClick={handleReservar}
        disabled={isDisabled}
      >
        Reservar
      </Button>
    </Card>
  )
}

export default ResumenReserva
