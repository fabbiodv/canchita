'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { confirmBooking, fetchBookings } from "@/utils/bookings"
import { formatDate } from "@/utils/dates"
import { ConfirmarReserva } from "@/components/reserva/confirmar-reserva"

interface Reservation {
    id: number
    fieldName: string
    centerName: string
    customerName: string
    customerEmail: string
    date: string
    startTime: string
    endTime: string
    status: string
    totalAmount: number
}

export default function ReservationsPage() {
    const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
    const [pastReservations, setPastReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadReservations() {
            try {
                setIsLoading(true)
                const data = await fetchBookings()

                setUpcomingReservations(data?.upcomingBookings ?? [])
                setPastReservations(data?.pastBookings ?? [])
            } catch (error) {
                console.error('Error fetching reservations:', error)
                setUpcomingReservations([])
                setPastReservations([])
            } finally {
                setIsLoading(false)
            }
        }

        loadReservations()
    }, [])

    const statusMap: Record<string, string> = {
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmada',
        CANCELLED: 'Cancelada'
    }

    const handleConfirmReservation = async (reservationId: number) => {
        try {
            await confirmBooking(reservationId)

            setUpcomingReservations(prevReservations =>
                prevReservations.map(reservation =>
                    reservation.id === reservationId
                        ? { ...reservation, status: 'CONFIRMED' }
                        : reservation
                )
            )

            return Promise.resolve()
        } catch (error) {
            console.error('Error al confirmar la reserva:', error)
            return Promise.reject(error)
        }
    }

    const ReservationsTable = ({ reservations = [] }: { reservations: Reservation[] }) => (
        <Table className="min-w-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden md:table-cell">ID</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead className="hidden lg:table-cell">Centro deportivo</TableHead>
                    <TableHead className="hidden sm:table-cell">Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="hidden xs:table-cell">Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden sm:table-cell">Monto</TableHead>
                    <TableHead>Acción</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={10} className="text-center">
                            Cargando reservas...
                        </TableCell>
                    </TableRow>
                ) : reservations.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={10} className="text-center">
                            No hay reservas disponibles
                        </TableCell>
                    </TableRow>
                ) : (
                    reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                            <TableCell className="hidden md:table-cell">{reservation.id}</TableCell>
                            <TableCell className="font-medium">
                                {reservation.fieldName}
                                <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                    {reservation.customerEmail}
                                </div>
                                <div className="xs:hidden text-xs text-muted-foreground">
                                    {reservation.startTime} - {reservation.endTime}
                                </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">{reservation.centerName}</TableCell>
                            <TableCell className="hidden sm:table-cell">{reservation.customerEmail}</TableCell>
                            <TableCell>
                                {formatDate(reservation.date)}
                            </TableCell>
                            <TableCell className="hidden xs:table-cell">{reservation.startTime}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                    reservation.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {statusMap[reservation.status]}
                                </span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">${reservation.totalAmount}</TableCell>
                            <TableCell>
                                <ConfirmarReserva
                                    reservaId={reservation.id}
                                    onConfirm={handleConfirmReservation}
                                    disabled={reservation.status === 'CONFIRMED' || reservation.status === 'CANCELLED'}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Reservas</CardTitle>
                    <CardDescription>Gestiona las reservas de tus canchas deportivas</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upcoming">Próximas Reservas</TabsTrigger>
                            <TabsTrigger value="past">Historial de Reservas</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming">
                            <ReservationsTable reservations={upcomingReservations} />
                        </TabsContent>
                        <TabsContent value="past">
                            <ReservationsTable reservations={pastReservations} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
