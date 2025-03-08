import { User } from "@/types/user"

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${email}`, {
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Error al obtener usuario por email')
        }

        return await response.json()
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}