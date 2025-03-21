'use client'

import { use } from "react"
import { useEffect, useState } from "react"
import Link from 'next/link'
import BookingCalendar from '@/components/reserva/booking-calendar'
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
                <BookingCalendar />
            </main>
        </div >
    )
}
