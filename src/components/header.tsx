'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { ThemeToggle } from "@/components/layout/theme-toggle"

const Header = () => {
    const { user, isLoading } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
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

    const NavigationItems = () => (
        <div className="flex flex-col md:flex-row items-center gap-4">
            <ThemeToggle />
            {isLoading ? (
                <span className="text-sm text-gray-500">Cargando...</span>
            ) : user ? (
                <>
                    <Link href="/profile/bookings">
                        <Button variant="outline" className="w-full md:w-auto">
                            <span className="text-sm">{user.email}</span>
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full md:w-auto"
                    >
                        Cerrar Sesión
                    </Button>
                </>
            ) : (
                <Button variant="outline" asChild className="w-full md:w-auto">
                    <Link href="/login">
                        Ingresar
                    </Link>
                </Button>
            )}
        </div>
    )

    return (
        <header className='py-6 px-4 md:px-8 flex justify-between items-center border-b border-gray-200'>
            <div className="flex-1 text-center md:text-left pl-10 md:pl-2">
                <Link href="/" className='text-2xl md:text-3xl font-bold'>
                    Canchita
                </Link>
            </div>

            {/* Navegación para escritorio */}
            <div className="hidden md:block">
                <NavigationItems />
            </div>

            {/* Menú móvil */}
            <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Abrir menú">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                        <SheetHeader>
                            <SheetTitle>Menú</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                            <NavigationItems />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

export default Header
