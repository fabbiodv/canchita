export const createBooking = async (fieldId: number, date: string, startTime: string, endTime: string, pricePerHour: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                fieldId,
                date,
                startTime,
                endTime,
                status: 'CONFIRMED',
                pricePerHour,
            })
        })
        if (!response.ok) {
            throw new Error('Error al crear la reserva')
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