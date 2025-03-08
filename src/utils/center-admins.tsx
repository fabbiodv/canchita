import { toast } from "sonner"

export interface CenterAdmin {
    id: number
    userId: number
    centerId: number
    permissions: string[]
    createdAt: string
    updatedAt: string
    user: {
        id: number
        email: string
        name: string | null
        lastName: string | null
    }
}



export const deleteCenterAdmin = async (adminId: number): Promise<boolean> => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/center-admins/${adminId}`,
            {
                method: 'DELETE',
                credentials: 'include'
            }
        )

        if (!response.ok) {
            throw new Error('Error al eliminar administrador')
        }

        return true
    } catch (error) {
        console.error('Error:', error)
        toast.error('Error al eliminar administrador')
        return false
    }
}

export const updateCenterAdminPermissions = async (
    adminId: number,
    permissions: string[]
): Promise<CenterAdmin | null> => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/center-admins/${adminId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ permissions })
            }
        )

        if (!response.ok) {
            throw new Error('Error al actualizar permisos')
        }

        return await response.json()
    } catch (error) {
        console.error('Error:', error)
        toast.error('Error al actualizar permisos')
        return null
    }
}

export const createCenterAdmin = async (centerId: number, userId: number, permissions: string[]): Promise<CenterAdmin | null> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/center-admins/center/${centerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ userId, permissions })
        })

        if (!response.ok) {
            throw new Error('Error al crear administrador')
        }

        return await response.json()
    }
    catch (error) {
        console.error('Error:', error)
        toast.error('Error al crear administrador')
        return null
    }
}

export const getMyCentersAdmins = async (): Promise<CenterAdmin[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/center-admins/my-centers`, {
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Error al obtener administradores de mis centros')
        }

        return await response.json()
    }
    catch (error) {
        console.error('Error:', error)
        toast.error('Error al obtener administradores de mis centros')
        return []
    }
}