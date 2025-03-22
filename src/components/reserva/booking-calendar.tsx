"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import dayjs from "dayjs"
import 'dayjs/locale/es'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Center } from "@/types/center"
import { createBooking } from "@/utils/bookings"
import { formatDateForApi } from "@/utils/formatDate"
import { TimeSlot, BookingStatus } from "@/types/booking"
dayjs.locale('es')

// Importaciones de componentes nuevos
import { FieldSelection } from "./field-selection"
import { CalendarView } from "./calendar-view"
import { TimeSlotGrid } from "./time-slot-grid"
import { BookingDialog } from "./booking-dialog"

// Hooks personalizados
import { useBookingFields } from "@/hooks/useBookingFields"
import { useBookingTimeSlots } from "@/hooks/useBookingTimeSlots"
import { formatFieldType, formatSurfaceType } from "@/utils/formatFields"

export default function BookingCalendar({ center }: { center: Center }) {
  const router = useRouter()
  const { centerId } = useParams()
  const { user } = useAuth()

  // Estados principales
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>({ success: true, message: '' })

  // Hooks personalizados
  const { fields, selectedField, handleFieldSelect, handleResetSelection } = useBookingFields(centerId as string)
  const { timeSlots, isLoading, loadTimeSlots } = useBookingTimeSlots()

  // Efecto para cargar horarios cuando cambia la cancha o fecha
  useEffect(() => {
    if (selectedField && selectedDate) {
      loadTimeSlots(selectedField.id.toString(), selectedDate, centerId as string)
    }
  }, [selectedField, selectedDate, loadTimeSlots, centerId])

  const handleTimeClick = (time: string) => {
    setSelectedTime(time)
    setDialogOpen(true)
  }

  const handleBookingSubmit = async () => {
    try {
      if (!selectedField || !selectedDate || !selectedTime || !centerId) {
        throw new Error('Faltan datos para crear la reserva')
      }

      // Obtenemos el precio del horario seleccionado
      const selectedSlot = timeSlots.find((slot: TimeSlot) => slot.time === selectedTime)
      const price = selectedSlot ? parseFloat(selectedSlot.price) : 0

      // Calculamos la hora de finalización
      const [hour, minutes] = selectedTime.split(':').map(Number)
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

      // Convertimos la fecha al formato esperado
      const formattedDate = formatDateForApi(selectedDate)

      setIsSubmitting(true)

      await createBooking(
        parseInt(selectedField.id.toString()),
        formattedDate,
        selectedTime,
        endTime,
        price
      )

      setBookingStatus({
        success: true,
        message: 'Reserva creada con éxito. Pendiente de confirmación por el dueño.'
      })
      setDialogOpen(false)

      setTimeout(() => {
        router.push("/profile/bookings")
      }, 2000)
    } catch (error) {
      console.error('Error al crear la reserva:', error)
      setBookingStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Error al crear la reserva'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {!selectedField ? (
        <FieldSelection
          fields={fields}
          onFieldSelect={handleFieldSelect}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              <span className="font-bold">{formatFieldType(selectedField.type)}</span>
              <span className="text-muted-foreground"> - </span>
              <span className="font-bold">{formatSurfaceType(selectedField.surface)}</span>
            </h2>
            <Button variant="outline" size="sm" onClick={handleResetSelection}>
              Cambiar cancha
            </Button>
          </div>

          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          {selectedDate && (
            <TimeSlotGrid
              selectedDate={selectedDate}
              timeSlots={timeSlots}
              isLoading={isLoading}
              onTimeSelect={handleTimeClick}
            />
          )}
        </>
      )}

      <BookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bookingStep={bookingStep}
        setBookingStep={setBookingStep}
        selectedField={selectedField}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        timeSlots={timeSlots}
        center={center}
        user={user}
        bookingStatus={bookingStatus}
        isSubmitting={isSubmitting}
        onSubmit={handleBookingSubmit}
      />
    </div>
  )
}

