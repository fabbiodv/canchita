export interface Field {
    id: number
    name: string
    description?: string
    type: string
    surface: string
    price: number
    status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
    openTime: string
    closeTime: string
    createdAt: string
    centerId: number
}
