'use client'

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            toast.error('Debes iniciar sesión para acceder a esta página')
            router.push('/login')
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Cargando...</p>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return <>{children}</>
}