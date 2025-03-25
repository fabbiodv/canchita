'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchMyBookings } from "@/utils/bookings"
import { formatDate } from "@/utils/dates"
interface Booking {
    id: string
    fieldName: string
    centerName: string
    date: string
    startTime: string
    endTime: string
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    totalPrice: number
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])

    useEffect(() => {
        fetchMyBookings().then((bookings) => {
            setBookings(bookings)
        })
    }, [])

    const statusMap = {
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmada',
        CANCELLED: 'Cancelada'
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Mis Reservas</CardTitle>
                    <CardDescription>Historial de tus reservas de canchas deportivas</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead className="hidden md:table-cell">Cancha</TableHead>
                                <TableHead>Centro Deportivo</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="hidden md:table-cell">Horario</TableHead>
                                <TableHead className="md:hidden">Hora</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Precio</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell className="hidden md:table-cell">{booking.fieldName}</TableCell>
                                    <TableCell>{booking.centerName}</TableCell>
                                    <TableCell>{formatDate(booking.date)}</TableCell>
                                    <TableCell className="hidden md:table-cell">{`${booking.startTime} - ${booking.endTime}`}</TableCell>
                                    <TableCell className="md:hidden">{`${booking.startTime}`}</TableCell>
                                    <TableCell>{statusMap[booking.status]}</TableCell>
                                    <TableCell>${booking.totalPrice}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}