export interface TimeSlot {
    time: string
    status: string
    price: string
}

export interface BookingStatus {
    success: boolean
    message: string
}

export interface Booking {
    id: number
    fieldId: number
    userId: number
    date: string
    startTime: string
    endTime: string
    status: string
    createdAt: string
    price: number
} 