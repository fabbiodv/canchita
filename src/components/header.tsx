'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function Header() {
    const { user, isLoading } = useAuth()

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            if (response.ok) {
                toast.success('Sesión cerrada exitosamente')
                window.location.href = '/'
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            toast.error('Error al cerrar sesión')
        }
    }

    return (
        <header className='py-6 px-8 flex justify-between items-center border-b border-gray-200'>
            <Link href="/" className='text-3xl font-bold'>
                Canchita
            </Link>

            <div className="flex items-center gap-4">
                {isLoading ? (
                    <span className="text-sm text-gray-500">Cargando...</span>
                ) : user ? (
                    <>
                        <span className="text-sm">{user.email}</span>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" asChild>
                        <Link href="/login">
                            Ingresar
                        </Link>
                    </Button>
                )}
            </div>
        </header>
    )
}
