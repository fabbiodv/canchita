'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const AuthCallback = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const status = searchParams.get('status')
    const error = searchParams.get('error')

    useEffect(() => {
        if (status === 'success') {
            toast.success('Inicio de sesión exitoso')
            router.push('/') // O la ruta que desees después del login
        } else if (error) {
            toast.error('Error en la autenticación')
            router.push('/login')
        }
    }, [status, error, router])

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Verificando autenticación...</h2>
                <p className="text-gray-500">Por favor espere...</p>
            </div>
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <AuthCallback />
        </Suspense>
    )
}
