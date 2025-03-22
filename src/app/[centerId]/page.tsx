'use client'

import { use } from "react"
import { useEffect, useState } from "react"
import Link from 'next/link'
import BookingCalendar from '@/components/reserva/booking-calendar'
import { Center } from "@/types/center"



interface PageProps {
    params: Promise<{ centerId: string }>
}

export default function ReservePage({ params }: PageProps) {
    const { centerId } = use(params)
    const [center, setCenter] = useState<Center>()

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
                })
            }
        }

        fetchCenterDetails()
    }, [centerId])

    if (center?.id === 0) {
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

    if (center?.id === 0) {
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
                <BookingCalendar center={center as Center} />
            </main>
        </div >
    )
}
