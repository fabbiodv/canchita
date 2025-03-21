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

export default function BookingCalendar() {
  const router = useRouter()
  const { centerId } = useParams()
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null)
  const [courtTypes, setCourtTypes] = useState<{ type: string, surface: string }[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Mock data for calendar
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const [viewMonth, setViewMonth] = useState(currentMonth)
  const [viewYear, setViewYear] = useState(currentYear)

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  // Mock data for time slots
  const timeSlots = [
    { time: "08:00", status: "available", price: "$50" },
    { time: "09:00", status: "available", price: "$50" },
    { time: "10:00", status: "available", price: "$50" },
    { time: "11:00", status: "booked", price: "$50" },
    { time: "12:00", status: "booked", price: "$50" },
    { time: "13:00", status: "available", price: "$60" },
    { time: "14:00", status: "available", price: "$60" },
    { time: "15:00", status: "available", price: "$60" },
    { time: "16:00", status: "available", price: "$70" },
    { time: "17:00", status: "available", price: "$70" },
    { time: "18:00", status: "available", price: "$80" },
    { time: "19:00", status: "available", price: "$80" },
    { time: "20:00", status: "booked", price: "$80" },
    { time: "21:00", status: "available", price: "$70" },
    { time: "22:00", status: "available", price: "$70" },
  ]

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
      console.log(data)
      setCourtTypes(data)
    }
    fetchCourtTypes()
  }, [centerId])

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

  const handleBookingSubmit = () => {
    // In a real app, this would submit the booking data to the server
    setDialogOpen(false)
    router.push("/booking-confirmation")
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

  const handleCourtSelect = (courtId: string) => {
    setSelectedCourt(courtId)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleResetSelection = () => {
    setSelectedCourt(null)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  return (
    <div className="space-y-6">
      {!selectedCourt ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Selecciona un tipo de cancha</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courtTypes.map((court) => (
              <Card key={court.type} className="overflow-hidden cursor-pointer hover:border-primary" onClick={() => handleCourtSelect(court.type)}>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{formatFieldType(court.type)}</h3>
                  <p className="text-sm text-muted-foreground">Superficie: {formatSurfaceType(court.surface)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              <span className="font-bold">{formatFieldType(courtTypes.find(c => c.type === selectedCourt)?.type ?? '')}</span>
              <span className="text-muted-foreground"> - </span>
              <span className="font-bold">{formatSurfaceType(courtTypes.find(c => c.type === selectedCourt)?.surface ?? '')}</span>
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
              {/* <TabsTrigger value="list">
                <Clock className="mr-2 h-4 w-4" />
                Horarios
              </TabsTrigger> */}
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
                      Horarios disponibles para{" "}
                      {new Date(selectedDate).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={slot.status === "booked"}
                          onClick={() => handleTimeClick(slot.time)}
                          className={`p-2 rounded-md border text-center ${slot.status === "available"
                            ? "border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30"
                            : "border-red-300 bg-red-50 text-muted-foreground opacity-60 cursor-not-allowed dark:bg-red-950/10"
                            }`}
                        >
                          <div className="font-medium">{slot.time}</div>
                          <div className="text-xs">{slot.price}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* <TabsContent value="list">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {[0, 1, 2, 3, 4].map((dayOffset) => {
                    const date = new Date()
                    date.setDate(date.getDate() + dayOffset)
                    const dateStr = date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })

                    return (
                      <div key={dayOffset} className="space-y-2">
                        <h3 className="font-medium">{dateStr}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {timeSlots.slice(0, 8).map((slot) => (
                            <button
                              key={`${dayOffset}-${slot.time}`}
                              disabled={Math.random() > 0.7}
                              onClick={() => {
                                setSelectedDate(date.toISOString().split("T")[0])
                                handleTimeClick(slot.time)
                              }}
                              className={`p-2 rounded-md border text-center ${Math.random() > 0.7
                                ? "border-red-300 bg-red-50 text-muted-foreground opacity-60 cursor-not-allowed dark:bg-red-950/10"
                                : "border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30"
                                }`}
                            >
                              <div className="font-medium">{slot.time}</div>
                              <div className="text-xs">{slot.price}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent> */}

          </Tabs>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reservar Cancha</DialogTitle>
            <DialogDescription>
              {selectedCourt && selectedDate && selectedTime && (
                <>
                  {courtTypes.find(c => c.type === selectedCourt)?.type} -
                  Fecha: {new Date(selectedDate).toLocaleDateString("es-ES")} a las {selectedTime}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {bookingStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" placeholder="Ingresa tu nombre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="+54 9 11 1234-5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Tarjeta de crédito/débito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer">Transferencia bancaria</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Efectivo en el lugar</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>Equipamiento adicional</Label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    Pelotas (+$5)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    Petos (+$10)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    Agua (+$3)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    Árbitro (+$30)
                  </label>
                </div>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-medium">Resumen de la reserva</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Cancha:</div>
                  <div>{courtTypes.find(c => c.type === selectedCourt)?.type} - {courtTypes.find(c => c.type === selectedCourt)?.surface}</div>
                  <div className="text-muted-foreground">Fecha:</div>
                  <div>{selectedDate && new Date(selectedDate).toLocaleDateString("es-ES")}</div>
                  <div className="text-muted-foreground">Hora:</div>
                  <div>{selectedTime}</div>
                  <div className="text-muted-foreground">Duración:</div>
                  <div>1 hora</div>
                  <div className="text-muted-foreground">Ubicación:</div>
                  <div>Sede Centro</div>
                  <div className="text-muted-foreground">Equipamiento:</div>
                  <div>Pelotas, Petos</div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>$65.00</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Información de pago</h4>
                <p className="text-sm text-muted-foreground">
                  Se realizará un cargo de $65.00 a tu tarjeta terminada en 4242.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {bookingStep === 1 ? (
              <Button onClick={() => setBookingStep(2)}>Continuar</Button>
            ) : (
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={() => setBookingStep(1)}>
                  Volver
                </Button>
                <Button onClick={handleBookingSubmit}>Confirmar Reserva</Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

