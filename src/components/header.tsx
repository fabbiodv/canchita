'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { Menu, LogOut, LandPlot, User, LayoutDashboard } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={""} alt={user.email} />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex w-full cursor-pointer">
                                <User className="h-4 w-4 mr-2" />
                                Mi Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin" className="flex w-full cursor-pointer">
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Administrador
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                            <LogOut className="h-4 w-4 mr-2" />
                            Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                <Link href="/" className='text-2xl md:text-3xl font-bold flex items-center'>
                    <LandPlot className="h-6 w-6 mr-2" />
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
