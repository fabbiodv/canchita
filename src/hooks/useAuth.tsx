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
                const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/session`
                console.log('Request URL:', url) // Agregar este log
                const response = await fetch(url, {
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
