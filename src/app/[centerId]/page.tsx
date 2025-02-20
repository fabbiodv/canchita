'use client'

import { use } from "react"
import { useEffect, useState } from "react"
import { es } from "date-fns/locale"
import { format } from 'date-fns'
import { startOfDay } from 'date-fns'
import { PhoneIcon, MailIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ResumenReserva from '@/components/reserva/resumen-reserva'
import { ReservaCalendario } from '@/components/reserva/reserva-calendario'
import { SelectorCancha } from '@/components/reserva/selector-cancha'
import { SelectorHorario } from '@/components/reserva/select-horario'

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
            setAvailableTimeSlots(field?.availability || [])
        } else {
            setAvailableTimeSlots([])
        }
    }, [selectedField, fields])

    const isDateDisabled = (date: Date) => {
        const startOfToday = startOfDay(new Date())
        return date < startOfToday
    }

    // Cargar detalles del centro
    useEffect(() => {
        async function fetchCenterDetails() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/centers/${centerId}`
                )
                const data = await response.json()
                setCenter(data)
            } catch (error) {
                console.error('Error al cargar detalles del centro:', error)
            }
        }

        fetchCenterDetails()
    }, [centerId])

    if (!center) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Cargando...</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen'>
            <main className='container mx-auto px-4 max-w-4xl'>

                <h1 className='text-2xl font-bold mb-6 text-center'>{center?.name}</h1>
                {!center.isAvailableForBooking ? (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Centro no disponible para reservas online</AlertTitle>
                        <AlertDescription className="space-y-4">
                            <p>{center.contactInfo?.message}</p>
                            <div className="space-y-2">
                                <p className="text-sm font-semibold">Contactar al centro:</p>
                                {center.contactInfo?.phone && (
                                    <p className="flex items-center gap-2">
                                        <PhoneIcon className="h-4 w-4" />
                                        <span>{center.contactInfo.phone}</span>
                                    </p>
                                )}
                                {center.contactInfo?.email && (
                                    <p className="flex items-center gap-2">
                                        <MailIcon className="h-4 w-4" />
                                        <span>{center.contactInfo.email}</span>
                                    </p>
                                )}
                            </div>
                        </AlertDescription>
                    </Alert>
                ) : (
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
                            precio={selectedField ? fields.find(f => f.id.toString() === selectedField)?.price : undefined}
                        />
                    </div>
                )}
            </main>
        </div >
    )
}
