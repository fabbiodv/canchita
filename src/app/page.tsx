'use client'

import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { es } from "date-fns/locale";

export default function Home() {

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  return (
    <div className='min-h-screen'>

      <header className='py-8 text-center'>
        <h1 className='text-4xl font-bold text-green-800'>Reservar Cancha</h1>
      </header>

      <main className='container mx-auto px-4 max-w-4xl'>
        <div className='grid gap-8 md:grid-cols-[1fr_300px]'>
          {/* Formulario Principal */}
          <div className='space-y-6'>
            {/* Selector de Cancha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Seleccionar Cancha
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Elige una cancha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cancha1">Cancha 1 - Fútbol 5</SelectItem>
                  <SelectItem value="cancha2">Cancha 2 - Fútbol 7</SelectItem>
                  <SelectItem value="cancha3">Cancha 3 - Fútbol 11</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calendario */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Seleccionar Fecha
              </label>
              <Calendar
                mode="single"
                locale={es}
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full rounded-lg border shadow p-3"
                classNames={{
                  months: 'w-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'w-full',
                  table: 'w-full',
                  head_row: 'w-full',
                  row: 'w-full',
                }}
              />
            </div>

            {/* Selector de Hora */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Seleccionar Horario
              </label>
              <Select>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Elige un horario' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">18:00 - 19:00</SelectItem>
                  <SelectItem value='19'>19:00 - 20:00</SelectItem>
                  <SelectItem value='20'>20:00 - 21:00</SelectItem>
                  <SelectItem value='21'>21:00 - 22:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resumen de Reserva */}
          <Card className='p-6 space-y-4 h-fit'>
            <h2 className="text-xl font-semibold text-gray-800">
              Resumen de Reserva
            </h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600">Cancha:</span>
                <span className="font-medium">Cancha 1 - Fútbol 5</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">15 de Marzo, 2024</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Hora:</span>
                <span className="font-medium">19:00 - 20:00</span>
              </p>
              <div className="border-t pt-2 mt-2">
                <p className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>$200</span>
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-[#009ee3] hover:bg-[#008ed0] text-white"
              size="lg"
            >

              Reservar y Pagar
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
