'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TimeSlot {
    startTime: string
    endTime: string
    isAvailable: boolean
}

interface SelectorHorarioProps {
    timeSlots: TimeSlot[]
    selectedTime: string
    onTimeSelect: (value: string) => void
    disabled: boolean
}

export const SelectorHorario = ({
    timeSlots,
    selectedTime,
    onTimeSelect,
    disabled
}: SelectorHorarioProps) => {
    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
                Seleccionar Horario
            </label>
            <Select
                onValueChange={onTimeSelect}
                value={selectedTime}
                disabled={disabled}
            >
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Elige un horario' />
                </SelectTrigger>
                <SelectContent>
                    {timeSlots.map((slot) => (
                        <SelectItem
                            key={slot.startTime}
                            value={slot.startTime}
                            disabled={!slot.isAvailable}
                        >
                            {slot.startTime} - {slot.endTime}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
