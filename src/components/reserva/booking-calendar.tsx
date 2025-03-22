"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { formatFieldType, formatSurfaceType } from "@/utils/formatFields"
import dayjs from "dayjs"
import 'dayjs/locale/es'
import { useAuth } from "@/hooks/useAuth"
import { Center } from "@/types/center"
import { createBooking } from "@/utils/bookings"
dayjs.locale('es')


export default function BookingCalendar({ center }: { center: Center }) {
  const router = useRouter()
  const { centerId } = useParams()
  const [selectedCourtType, setSelectedCourtType] = useState<string | null>(null)
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null)
  const [courtTypes, setCourtTypes] = useState<{ type: string, surface: string }[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [timeSlots, setTimeSlots] = useState<{ time: string, status: string, price: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingStatus, setBookingStatus] = useState({ success: true, message: '' })
  const [availableFields, setAvailableFields] = useState([])

  // Mock data for calendar
  const { user } = useAuth()
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const [viewMonth, setViewMonth] = useState(currentMonth)
  const [viewYear, setViewYear] = useState(currentYear)

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  // Función para obtener los horarios disponibles
  const fetchAvailableTimeSlots = async (fieldId: string, date: string) => {
    try {
      setIsLoading(true)
      // Formatear la fecha a DD/MM/YYYY para la API
      const [year, month, day] = date.split('-')
      const formattedDate = `${day}/${month}/${year}`

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/slots/${centerId}?fieldId=${fieldId}&date=${formattedDate}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Error al obtener horarios disponibles')
      }

      const data = await response.json()
      setTimeSlots(data)
    } catch (error) {
      console.error('Error al obtener horarios:', error)
      // En caso de error, mostrar slots vacíos o un mensaje de error
      setTimeSlots([])
    } finally {
      setIsLoading(false)
    }
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  useEffect(() => {
    const fetchCourtTypes = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/types/${centerId}`)
      const data = await response.json()
      setCourtTypes(data)
    }
    fetchCourtTypes()
  }, [centerId])

  // Effect para cargar las canchas específicas cuando se selecciona un tipo
  useEffect(() => {
    const fetchFieldsByType = async () => {
      if (selectedCourtType) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/center/${centerId}?type=${selectedCourtType}`, {
            credentials: 'include'
          })

          if (!response.ok) {
            throw new Error('Error al obtener canchas disponibles')
          }

          const fields = await response.json()
          setAvailableFields(fields)

          // Seleccionar la primera cancha automáticamente si hay disponibles
          if (fields.length > 0) {
            setSelectedCourt(fields[0].id.toString())
          }
        } catch (error) {
          console.error('Error al obtener canchas:', error)
          setAvailableFields([])
        }
      }
    }

    fetchFieldsByType()
  }, [selectedCourtType, centerId])

  // Effect para cargar los horarios cuando se selecciona una cancha y una fecha
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      fetchAvailableTimeSlots(selectedCourt, selectedDate)
    }
  }, [selectedCourt, selectedDate])

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(viewYear, viewMonth, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // No permitir seleccionar fechas anteriores a hoy
    if (selectedDate < today) return

    const dateStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    setSelectedDate(dateStr)
  }

  const handleTimeClick = (time: string) => {
    setSelectedTime(time)
    setDialogOpen(true)
  }

  const handleBookingSubmit = async () => {
    try {
      if (!selectedCourt || !selectedDate || !selectedTime || !centerId) {
        throw new Error('Faltan datos para crear la reserva')
      }

      // Obtenemos el precio del horario seleccionado (sin el símbolo $)
      const selectedSlot = timeSlots.find(slot => slot.time === selectedTime)
      const price = selectedSlot ? parseFloat(selectedSlot.price) : 0

      // Calculamos la hora de finalización (1 hora después de la seleccionada)
      const [hour, minutes] = selectedTime.split(':').map(Number)
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

      // Convertimos la fecha al formato DD/MM/YYYY que espera la API
      const [year, month, day] = selectedDate.split('-')
      const formattedDate = `${day}/${month}/${year}`

      // Mostramos el estado de carga
      setIsSubmitting(true)

      // Llamamos a la función createBooking con todos los parámetros necesarios
      await createBooking(
        parseInt(selectedCourt),
        formattedDate,
        selectedTime,
        endTime,
        price
      )

      // La reserva se ha creado con éxito
      setBookingStatus({ success: true, message: 'Reserva creada con éxito. Pendiente de confirmación por el dueño.' })
      setDialogOpen(false)

      // Redirigimos al usuario a la página de confirmación
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

  const renderCalendarDays = () => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
      const isSelected = dateStr === selectedDate
      const isToday =
        day === currentDate.getDate() && viewMonth === currentDate.getMonth() && viewYear === currentDate.getFullYear()

      const currentDayDate = new Date(viewYear, viewMonth, day)
      const isPastDay = currentDayDate < today

      days.push(
        <button
          key={day}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm ${isSelected
            ? "bg-primary text-primary-foreground"
            : isToday
              ? "border border-primary text-primary"
              : isPastDay
                ? "text-muted-foreground opacity-50 cursor-not-allowed"
                : "hover:bg-muted"
            }`}
          onClick={() => handleDateClick(day)}
          disabled={isPastDay}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const handleCourtTypeSelect = (courtType: string) => {
    setSelectedCourtType(courtType)
    setSelectedCourt(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setTimeSlots([])
  }

  const handleResetSelection = () => {
    setSelectedCourtType(null)
    setSelectedCourt(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setTimeSlots([])
  }

  return (
    <div className="space-y-6">
      {!selectedCourtType ? (
        <>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Selecciona un tipo de cancha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courtTypes.map((court, index) => (
                <Card key={index} className="overflow-hidden cursor-pointer hover:border-primary" onClick={() => handleCourtTypeSelect(court.type)}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{formatFieldType(court.type)}</h3>
                    <p className="text-sm text-muted-foreground">Superficie: {formatSurfaceType(court.surface)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : availableFields.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              <span className="font-bold">{formatFieldType(courtTypes.find(c => c.type === selectedCourtType)?.type ?? '')}</span>
              <span className="text-muted-foreground"> - </span>
              <span className="font-bold">{formatSurfaceType(courtTypes.find(c => c.type === selectedCourtType)?.surface ?? '')}</span>
            </h2>
            <Button variant="outline" size="sm" onClick={handleResetSelection}>
              Cambiar tipo de cancha
            </Button>
          </div>
          <Tabs defaultValue="calendar">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Calendario
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">
                      {monthNames[viewMonth]} {viewYear}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {dayNames.map((day) => (
                      <div
                        key={day}
                        className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
                      >
                        {day}
                      </div>
                    ))}
                    {renderCalendarDays()}
                  </div>
                </CardContent>
              </Card>

              {selectedDate && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-4">
                      Horarios disponibles para el{" "}
                      {dayjs(selectedDate).format('dddd DD [de] MMMM [de] YYYY')}
                    </h3>
                    {isLoading ? (
                      <div className="py-8 text-center">Cargando horarios disponibles...</div>
                    ) : timeSlots.length === 0 ? (
                      <div className="py-8 text-center">No hay horarios disponibles para esta fecha.</div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={slot.status === "pending" || slot.status === "confirmed"}
                            onClick={() => handleTimeClick(slot.time)}
                            className={`p-2 rounded-md border text-center ${slot.status === "pending" || slot.status === "confirmed"
                              ? "border-red-300 bg-red-50 text-muted-foreground opacity-60 cursor-not-allowed dark:bg-red-950/10"
                              : "border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30"
                              }`}
                          >
                            <div className="font-medium">{slot.time}</div>
                            <div className="text-xs">${slot.price}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="py-8 text-center">No hay canchas disponibles para el tipo seleccionado.</div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reservar Cancha</DialogTitle>
            <DialogDescription>
              {selectedCourt && selectedDate && selectedTime && (

                <div className="text-sm text-muted-foreground">
                  <span className="font-bold">{formatFieldType(courtTypes.find(c => c.type === selectedCourtType)?.type ?? '')}</span> -
                  <span className="text-muted-foreground"> {formatSurfaceType(courtTypes.find(c => c.type === selectedCourtType)?.surface ?? '')}</span>
                  <span className="text-muted-foreground"> Fecha: {dayjs(selectedDate).format('DD MMMM YYYY')} a las {selectedTime}</span>
                </div>

              )}
            </DialogDescription>
          </DialogHeader>

          {bookingStatus.message && (
            <div className={`p-3 rounded-md mb-4 ${bookingStatus.success ? 'bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300'}`}>
              {bookingStatus.message}
            </div>
          )}

          {bookingStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                {user?.name ? (
                  <Input id="name" placeholder={user?.name} disabled />
                ) : (
                  <Input id="name" placeholder="Ingresa tu nombre" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido</Label>
                {user?.lastName ? (
                  <Input id="lastname" placeholder={user?.lastName} disabled />
                ) : (
                  <Input id="lastname" placeholder="Ingresa tu apellido" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                {user?.dni ? (
                  <Input id="dni" placeholder={user?.dni} disabled />
                ) : (
                  <Input id="dni" placeholder="Ingresa tu DNI" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="11 1234-5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input placeholder={user?.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <RadioGroup defaultValue="cash">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Efectivo en el lugar</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <>
              <div className="space-y-4 py-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-medium">Resumen de la reserva</h4>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="text-muted-foreground">Cancha:</div>
                    <div>{formatFieldType(courtTypes.find(c => c.type === selectedCourtType)?.type ?? '')} - {formatSurfaceType(courtTypes.find(c => c.type === selectedCourtType)?.surface ?? '')}</div>
                    <div className="text-muted-foreground">Fecha:</div>
                    <div>{dayjs(selectedDate).format('dddd DD [de] MMMM [de] YYYY')}</div>
                    <div className="text-muted-foreground">Hora:</div>
                    <div>{selectedTime}</div>
                    <div className="text-muted-foreground">Duración:</div>
                    <div>1 hora</div>
                    <div className="text-muted-foreground">Centro:</div>
                    <div>{center?.name}</div>
                    <div className="text-muted-foreground">Dirección:</div>
                    <div>{center?.address}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${timeSlots.find(slot => slot.time === selectedTime)?.price}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Información 🚧</h4>
                  <p className="text-sm text-muted-foreground">
                    Una vez enviada la solicitud, tendras que esperar a que el dueño del centro confirme la reserva.
                  </p>
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            {bookingStep === 1 ? (
              <Button onClick={() => setBookingStep(2)}>Continuar</Button>
            ) : (
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={() => setBookingStep(1)} disabled={isSubmitting}>
                  Volver
                </Button>
                <Button onClick={handleBookingSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

