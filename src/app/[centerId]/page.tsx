'use client'

import { use } from "react"
import { useEffect, useState } from "react"
import { es } from "date-fns/locale"
import { format } from 'date-fns'
import ResumenReserva from '@/components/reserva/resumen-reserva'
import { ReservaCalendario } from '@/components/reserva/reserva-calendario'
import { SelectorCancha } from '@/components/reserva/selector-cancha'
import { SelectorHorario } from '@/components/reserva/select-horario'
import Link from 'next/link'
import { isDateDisabled } from '@/utils/dates'

interface Center {
    id: number
    name: string
    address: string
    isAvailableForBooking: boolean
    contactInfo?: {
        message: string
        phone?: string
        email?: string
    }
    notFound?: boolean
    error?: boolean
}

interface Field {
    id: number
    name: string
    type: string
    surface: string
    price: number
    centerName: string
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
    const [center, setCenter] = useState<Center>()
    const [selectedField, setSelectedField] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [selectedEndTime, setSelectedEndTime] = useState<string>("")
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])

    // Cargar disponibilidad cuando cambia la fecha
    useEffect(() => {
        async function fetchAvailability() {
            if (!selectedDate) return

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/fields/center/${centerId}/availability?date=${format(selectedDate, 'yyyy-MM-dd')}`
                )
                const data = await response.json()


                if (Array.isArray(data) && data.length > 0) {
                    console.log('DATA: ', data)
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

            // Obtener fecha actual en Argentina
            const now = new Date();
            const argentinaOffset = -3 * 60; // -3 horas en minutos
            const nowInArgentina = new Date(now.getTime() + (now.getTimezoneOffset() + argentinaOffset) * 60000);

            // Filtrar slots disponibles
            const filteredSlots = field?.availability?.filter(slot => {
                if (!selectedDate) return false;

                // Crear fecha completa para el horario del slot
                const [hours, minutes] = slot.startTime.split(':');
                const slotDateTime = new Date(selectedDate);
                slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                // Verificar si hay al menos 2 horas de diferencia
                const twoHoursInMs = 2 * 60 * 60 * 1000;
                return slotDateTime.getTime() - nowInArgentina.getTime() >= twoHoursInMs;
            }) || [];

            setAvailableTimeSlots(filteredSlots);
        } else {
            setAvailableTimeSlots([]);
        }
        // Resetear el horario seleccionado cuando cambia la cancha
        setSelectedTime("");
        setSelectedEndTime("");
    }, [selectedField, fields, selectedDate]);

    // Agregar efecto para actualizar horario fin
    useEffect(() => {
        if (selectedTime && availableTimeSlots.length > 0) {
            const currentSlot = availableTimeSlots.find(slot => slot.startTime === selectedTime)
            if (currentSlot) {
                setSelectedEndTime(currentSlot.endTime)
            }
        } else {
            setSelectedEndTime("")
        }
    }, [selectedTime, availableTimeSlots])



    // Cargar detalles del centro
    useEffect(() => {
        async function fetchCenterDetails() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/centers/${centerId}`
                )

                if (response.status === 404) {
                    setCenter({
                        id: 0,
                        name: '',
                        address: '',
                        isAvailableForBooking: false,
                        notFound: true
                    })
                    return
                }

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`)
                }

                const data = await response.json()
                setCenter(data)
            } catch (error) {
                console.error('Error al cargar detalles del centro:', error)
                setCenter({
                    id: 0,
                    name: '',
                    address: '',
                    isAvailableForBooking: false,
                    error: true
                })
            }
        }

        fetchCenterDetails()
    }, [centerId])

    if (center?.notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">Centro deportivo no encontrado</h2>
                <p className="text-gray-500">El centro que buscas no existe o no está disponible</p>
                <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
                    Volver al inicio
                </Link>
            </div>
        )
    }

    if (center?.error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">Error inesperado</h2>
                <p className="text-gray-500">Hubo un problema al cargar el centro deportivo</p>
                <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
                    Volver al inicio
                </Link>
            </div>
        )
    }

    return (
        <div className='min-h-screen'>
            <main className='container mx-auto px-4 max-w-4xl'>

                <h1 className='text-2xl font-bold my-6 text-center'>{center?.name}</h1>

                <div className='grid gap-8 md:grid-cols-[1fr_300px]'>
                    <div className='space-y-6'>
                        <ReservaCalendario
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                            isDateDisabled={isDateDisabled}
                        />
                        <SelectorCancha
                            fields={fields}
                            selectedField={selectedField}
                            onFieldSelect={setSelectedField}
                            disabled={!selectedDate}
                        />
                        <SelectorHorario
                            timeSlots={availableTimeSlots}
                            selectedTime={selectedTime}
                            onTimeSelect={setSelectedTime}
                            disabled={!selectedField}
                        />
                    </div>
                    <ResumenReserva
                        address={center?.address}
                        fieldId={selectedField ? fields.find(f => f.id.toString() === selectedField)?.id : undefined}
                        cancha={selectedField ? fields.find(f => f.id.toString() === selectedField)?.name : undefined}
                        fecha={selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: es }) : undefined}
                        hora={selectedTime}
                        horaFin={selectedEndTime}
                        precio={selectedField ? fields.find(f => f.id.toString() === selectedField)?.price : undefined}
                    />
                </div>

            </main>
        </div >
    )
}
