'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ResumenReservaProps {
  address?: string
  cancha?: string
  fecha?: string
  hora?: string
  precio?: number
  fieldId?: number
}

const ResumenReserva = ({
  address,
  cancha = 'Sin seleccionar',
  fecha = 'Sin seleccionar',
  hora = 'Sin seleccionar',
  precio = 2000,
  fieldId = 0
}: ResumenReservaProps) => {
  const ADELANTO = 2000;
  const [isPagoTotal, setIsPagoTotal] = useState(false);

  const montoAPagar = isPagoTotal ? precio : ADELANTO;

  const handleReservar = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/payments/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fieldId: fieldId,
          date: fecha,
          startTime: hora,
          userId: 1,
          isPagoTotal: isPagoTotal
        })
      })
      const data = await response.json()

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        toast.error('Error al procesar el pago');
      }
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
        <div className="border-t pt-2 mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isPagoTotal}
              onCheckedChange={setIsPagoTotal}
              id="pago-total"
            />
            <Label htmlFor="pago-total">
              Pagar precio total
            </Label>
          </div>

          <p className="flex justify-between text-lg font-semibold">
            <span>{isPagoTotal ? 'Total' : 'Adelanto'}:</span>
            <span>${montoAPagar}</span>
          </p>
        </div>
      </div>

      <Button
        className="w-full bg-[#009ee3] hover:bg-[#008ed0] text-white"
        size="lg"
        onClick={handleReservar}
        disabled={cancha === 'Sin seleccionar' || fecha === 'Sin seleccionar' || hora === 'Sin seleccionar'}
      >
        Pagar {isPagoTotal ? 'Total' : 'Adelanto'}
      </Button>
    </Card>
  )
}

export default ResumenReserva
