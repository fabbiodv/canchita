import { Field } from "@/types/field";

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

export const createField = async (data: Field) => {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fields/center/${data.centerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        })

        return response.json();
    } catch (error) {
        console.error('Error en createField:', error);
        throw error; // Re-lanzar el error para que pueda ser manejado por el componente
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

        const responseData = await response.json()

        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                error: responseData.error || 'Error al actualizar la cancha'
            }
        }

        return {
            success: true,
            data: responseData
        }
    } catch (error) {
        console.error('Error al actualizar cancha:', error)
        throw error
    }
}

