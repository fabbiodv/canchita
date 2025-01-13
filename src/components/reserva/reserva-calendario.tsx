'use client'
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"

interface ReservaCalendarioProps {
    selectedDate: Date | undefined
    onSelectDate: (date: Date | undefined) => void
    isDateDisabled: (date: Date) => boolean
}

export const ReservaCalendario = ({
    selectedDate,
    onSelectDate,
    isDateDisabled
}: ReservaCalendarioProps) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                Seleccionar Fecha
            </label>
            <Calendar
                mode="single"
                locale={es}
                selected={selectedDate}
                onSelect={onSelectDate}
                className="w-full rounded-lg border shadow p-3"
                classNames={{
                    months: 'w-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                    month: 'w-full',
                    table: 'w-full',
                    head_row: 'w-full',
                    row: 'w-full',
                }}
                disabled={isDateDisabled}
            />
        </div>
    )
}
