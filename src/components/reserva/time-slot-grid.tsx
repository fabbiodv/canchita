import { Card, CardContent } from "@/components/ui/card"
import dayjs from "dayjs"
import 'dayjs/locale/es'
import { TimeSlot } from "@/types/booking"
import { checkSlotStatus } from "@/utils/dates"
interface TimeSlotGridProps {
    selectedDate: string
    timeSlots: TimeSlot[]
    isLoading: boolean
    onTimeSelect: (time: string) => void
}

export function TimeSlotGrid({ selectedDate, timeSlots, isLoading, onTimeSelect }: TimeSlotGridProps) {

    return (
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
                                disabled={checkSlotStatus(selectedDate, slot)}
                                onClick={() => onTimeSelect(slot.time)}
                                className={`p-2 rounded-md border text-center ${checkSlotStatus(selectedDate, slot)
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
    )
} 