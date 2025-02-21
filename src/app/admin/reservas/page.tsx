'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchBookings } from "@/utils/bookings"

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
        setIsLoading(true)
        fetchBookings()
            .then((data) => {
                setUpcomingReservations(data.upcomingBookings)
                setPastReservations(data.pastBookings)
            })
            .catch((error) => {
                console.error('Error fetching reservations:', error)
                setUpcomingReservations([])
                setPastReservations([])
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const statusMap: Record<string, string> = {
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmada',
        CANCELLED: 'Cancelada'
    }

    const ReservationsTable = ({ reservations }: { reservations: Reservation[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Centro deportivo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora inicio</TableHead>
                    <TableHead>Hora fin</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center">
                            Cargando reservas...
                        </TableCell>
                    </TableRow>
                ) : reservations.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center">
                            No hay reservas disponibles
                        </TableCell>
                    </TableRow>
                ) : (
                    reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                            <TableCell>{reservation.fieldName}</TableCell>
                            <TableCell>{reservation.centerName}</TableCell>
                            <TableCell>{reservation.customerEmail}</TableCell>
                            <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                            <TableCell>{reservation.startTime}</TableCell>
                            <TableCell>{reservation.endTime}</TableCell>
                            <TableCell>{statusMap[reservation.status]}</TableCell>
                            <TableCell>${reservation.totalAmount}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm">
                                    Ver detalles
                                </Button>
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
