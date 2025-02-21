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