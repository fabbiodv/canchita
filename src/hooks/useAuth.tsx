import { useState, useEffect } from 'react'

interface User {
    id: number
    email: string
    name?: string
    lastName?: string
    mpAccessToken?: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
                    credentials: 'include'
                })

                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch (error) {
                console.error('Error al verificar sesión:', error)
            } finally {
                setIsLoading(false)
            }
        }

        checkSession()
    }, [])

    return { user, isLoading }
}
