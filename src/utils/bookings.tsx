import dayjs from 'dayjs'
import 'dayjs/locale/es'

export const createBooking = async (fieldId: number, date: string, startTime: string, endTime: string, pricePerHour: number) => {
    try {

        // Convertir fecha y hora locales a UTC
        // Formato de fecha esperado: DD/MM/YYYY
        // Formato de hora esperado: HH:MM
        const [day, month, year] = date.split('/')

        // Crear objeto de fecha con la fecha y hora de inicio local
        const [startHour, startMinute] = startTime.split(':').map(Number)
        const startDateLocal = new Date(Number(year), Number(month) - 1, Number(day), startHour, startMinute)

        // Crear objeto de fecha con la fecha y hora de fin local
        const [endHour, endMinute] = endTime.split(':').map(Number)
        const endDateLocal = new Date(Number(year), Number(month) - 1, Number(day), endHour, endMinute)

        // Convertir a cadenas en formato ISO para mantener la información de zona horaria
        const startTimeUTC = startDateLocal.toISOString()
        const endTimeUTC = endDateLocal.toISOString()

        // Si la hora de fin es anterior a la de inicio (por ejemplo, de 23:00 a 00:00),
        // puede que haya cambiado el día, ajustamos la fecha UTC según sea necesario

        console.log('Local start:', startDateLocal)
        console.log('UTC start:', startTimeUTC)
        console.log('Local end:', endDateLocal)
        console.log('UTC end:', endTimeUTC)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                fieldId,
                dateUTC: startTimeUTC, // Enviamos la fecha y hora de inicio en UTC
                startTime, // Mantenemos también el formato original para compatibilidad
                endTime,   // Mantenemos también el formato original para compatibilidad
                pricePerHour
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error al crear la reserva')
        }

        return await response.json()
    } catch (error) {
        console.error('Error al crear la reserva:', error)
        throw error
    }
}

export const fetchMyBookings = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/user`, {
            method: 'GET',
            credentials: 'include',
        })
        if (!response.ok) {
            throw new Error('Error al obtener las reservas')
        }
        return await response.json()
    } catch (error) {
        console.error('Error al obtener las reservas:', error)
        throw error
    }
}

export const fetchBookings = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-center`, {
            method: 'GET',
            credentials: 'include',
        })
        return await response.json()
    } catch (error) {
        console.error('Error al obtener las reservas:', error)
        throw error
    }
}

export const confirmBooking = async (bookingId: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/confirm`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Error al confirmar la reserva')
        }
        return await response.json()
    } catch (error) {
        console.error('Error al confirmar la reserva:', error)
        throw error
    }
}

// Función para formatear una fecha UTC a fecha local con el formato deseado
export const formatUtcToLocalDate = (utcDate: string | Date, format: string = 'DD/MM/YYYY') => {
    if (!utcDate) return '-'

    const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate

    // Obtener componentes de fecha en zona horaria local
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    // Formatear según el formato solicitado
    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year.toString())
        .replace('HH', hours)
        .replace('mm', minutes)
}

// Función para mostrar la fecha y hora en formato legible
export const formatBookingDateTime = (date: string | Date, time: string) => {
    if (!date) return '-'

    const bookingDate = typeof date === 'string' ? new Date(date) : date

    // Usar dayjs para formatear la fecha
    return dayjs(bookingDate)
        .locale('es')
        .format('dddd DD [de] MMMM [de] YYYY') + ' a las ' + time
}

export const fetchAvailableTimeSlots = async (centerId: number, fieldId: number, date: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/slots/${centerId}?fieldId=${fieldId}&date=${date}`, {
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Error al obtener los horarios disponibles')
        }
        return await response.json()
    } catch (error) {
        console.error('Error al obtener los horarios disponibles:', error)
        throw error
    }
}