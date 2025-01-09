'use client'

import { use } from "react"
import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { es } from "date-fns/locale"
import { format } from 'date-fns'
import ResumenReserva from '@/components/resumen-reserva'

interface Field {
    id: number
    name: string
    type: string
    surface: string
    price: number
    availability?: TimeSlot[]
}

interface TimeSlot {
    startTime: string
    endTime: string
    isAvailable: boolean
}

interface PageProps {
    params: Promise<{ centerId: string }>
}

export default function ReservePage({ params }: PageProps) {
    const { centerId } = use(params)
    const [fields, setFields] = useState<Field[]>([])
    const [selectedField, setSelectedField] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])

    // Cargar disponibilidad cuando cambia la fecha
    useEffect(() => {
        async function fetchAvailability() {
            if (!selectedDate) return

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/fields/center/${centerId}/availability?date=${format(selectedDate, 'yyyy-MM-dd')}`
                )
                const data = await response.json()

                // Asegurarnos de que data sea un array
                if (Array.isArray(data)) {
                    setFields(data)
                } else {
                    console.error('La respuesta no es un array:', data)
                    setFields([])
                }
            } catch (error) {
                console.error('Error al cargar disponibilidad:', error)
                setFields([])
            }
        }

        fetchAvailability()
    }, [selectedDate, centerId])

    // Actualizar slots disponibles cuando se selecciona una cancha
    useEffect(() => {
        if (selectedField && fields.length > 0) {
            const field = fields.find(f => f.id.toString() === selectedField)
            setAvailableTimeSlots(field?.availability || [])
        } else {
            setAvailableTimeSlots([])
        }
    }, [selectedField, fields])

    return (
        <div className='min-h-screen'>
            <main className='container mx-auto px-4 max-w-4xl'>
                <div className='grid gap-8 md:grid-cols-[1fr_300px]'>
                    <div className='space-y-6'>
                        {/* Calendario primero */}
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
                                disabled={(date) => date < new Date()}
                            />
                        </div>

                        {/* Selector de Cancha */}
                        {selectedDate && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Seleccionar Cancha
                                </label>
                                <Select onValueChange={setSelectedField} value={selectedField}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Elige una cancha" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(fields) && fields.length > 0 ? (
                                            fields.map((field) => (
                                                <SelectItem
                                                    key={field.id}
                                                    value={field.id.toString()}
                                                >
                                                    {field.name} - {field.type} (${field.price})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-fields" disabled>
                                                No hay canchas disponibles
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Selector de Hora */}
                        {selectedField && (
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700'>
                                    Seleccionar Horario
                                </label>
                                <Select onValueChange={setSelectedTime} value={selectedTime}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Elige un horario' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTimeSlots.map((slot) => (
                                            <SelectItem
                                                key={slot.startTime}
                                                value={slot.startTime}
                                                disabled={!slot.isAvailable}
                                            >
                                                {slot.startTime} - {slot.endTime}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Resumen de Reserva */}
                    <ResumenReserva
                        cancha={selectedField ? fields.find(f => f.id.toString() === selectedField)?.name : undefined}
                        fecha={selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: es }) : undefined}
                        hora={selectedTime ? availableTimeSlots.find(slot => slot.startTime === selectedTime)?.startTime : undefined}
                        precio={selectedField ? fields.find(f => f.id.toString() === selectedField)?.price : undefined}
                    />
                </div>
            </main>
        </div>
    )
}
