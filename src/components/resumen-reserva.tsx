'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface ResumenReservaProps {
  cancha?: string
  fecha?: string
  hora?: string
  precio?: number
}

const ResumenReserva = ({ 
  cancha = 'Sin seleccionar', 
  fecha = 'Sin seleccionar', 
  hora = 'Sin seleccionar', 
  precio = 0 
}: ResumenReservaProps) => {
  const handleReservar = () => {
    // Lógica para procesar la reserva
    toast.success('Reserva procesada correctamente')
  }

  return (
    <Card className='p-6 space-y-4 h-fit'>
      <h2 className="text-xl font-semibold text-gray-800">
        Resumen de Reserva
      </h2>
      <div className="space-y-2 text-sm">
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
        <div className="border-t pt-2 mt-2">
          <p className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${precio}</span>
          </p>
        </div>
      </div>

      <Button
        className="w-full bg-[#009ee3] hover:bg-[#008ed0] text-white"
        size="lg"
        onClick={handleReservar}
      >
        Reservar y Pagar
      </Button>
    </Card>
  )
}

export default ResumenReserva
