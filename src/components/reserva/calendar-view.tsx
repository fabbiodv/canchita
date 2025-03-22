import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CalendarViewProps {
    selectedDate: string | null
    onDateSelect: (date: string) => void
}

export function CalendarView({ selectedDate, onDateSelect }: CalendarViewProps) {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const [viewMonth, setViewMonth] = useState(currentMonth)
    const [viewYear, setViewYear] = useState(currentYear)

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

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
        onDateSelect(dateStr)
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

    return (
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
            </TabsContent>
        </Tabs>
    )
} 