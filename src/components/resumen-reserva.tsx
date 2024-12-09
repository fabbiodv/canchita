'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ResumenReservaProps {
  cancha: string
  fecha: string
  hora: string
  total: number
  onReservar?: () => void
}

const ResumenReserva = ({
  cancha = "Cancha 1 - Fútbol 5",
  fecha = "15 de Marzo, 2024",
  hora = "19:00 - 20:00",
  total = 200,
  onReservar
}: ResumenReservaProps) => {
  const handleReservar = () => {
    if (onReservar) {
      onReservar()
    }
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
            <span>${total}</span>
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
