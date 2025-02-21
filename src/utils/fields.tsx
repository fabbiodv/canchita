import { Field } from "@/types/field";

export const createField = async (data: Field) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/center/${data.centerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error('Error al crear la cancha')
    }

    return response.json()
}

export const fetchFields = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/user`, {
            credentials: 'include'
        })

        return response.json()
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

export const updateField = async (id: string, data: Field) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        })
        return response.json()
    } catch (error) {
        console.error('Error al actualizar cancha:', error)
        throw error
    }
}