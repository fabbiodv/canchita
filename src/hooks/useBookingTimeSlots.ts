import { useState, useCallback } from "react"
import { fetchAvailableTimeSlots } from "@/utils/bookings"
import { formatDateForApi } from "@/utils/formatDate"
import { TimeSlot } from "@/types/booking"

export function useBookingTimeSlots() {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const loadTimeSlots = useCallback(async (fieldId: string, date: string, centerId?: string) => {
        try {
            setIsLoading(true)
            // Formatear la fecha a DD/MM/YYYY para la API
            const formattedDate = formatDateForApi(date)

            // Usar el centerId proporcionado o extraerlo del fieldId si es necesario
            const centerIdNum = centerId ? parseInt(centerId) : parseInt(fieldId.split('-')[0] || '0')

            const response = await fetchAvailableTimeSlots(
                centerIdNum,
                parseInt(fieldId),
                formattedDate
            )

            setTimeSlots(response)
        } catch (error) {
            console.error('Error al obtener horarios:', error)
            setTimeSlots([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        timeSlots,
        isLoading,
        loadTimeSlots
    }
} 