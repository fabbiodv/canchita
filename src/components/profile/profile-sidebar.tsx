'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    User
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"

const sidebarItems = [
    {
        title: 'Mi Perfil',
        href: '/profile',
        icon: User,
    },
    {
        title: "Mis Reservas",
        href: "/profile/bookings",
        icon: Calendar,
    },
    /*
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Pagos",
        href: "/admin/pagos",
        icon: CreditCard,
    },
    {
        title: "Usuarios",
        href: "/admin/usuarios",
        icon: Users,
    },
    {
        title: "Configuración",
        href: "/admin/configuracion",
        icon: Settings,
    },*/
]

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname()

    return (
        <div className="space-y-4">
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold">Perfil</h2>
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn("w-full justify-start")}
                            onClick={onItemClick}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function ProfileSidebar() {
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            {/* Versión móvil */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="lg:hidden fixed left-3 top-6">
                    <Button variant="outline" size="icon">
                        <User className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Perfil</SheetTitle>
                    </SheetHeader>
                    <SidebarContent onItemClick={handleClose} />
                </SheetContent>
            </Sheet>

            {/* Versión desktop */}
            <aside className="hidden lg:block min-h-screen w-64 border-r bg-background px-4 py-6">
                <div className="flex h-full flex-col">
                    <SidebarContent />
                </div>
            </aside>
        </>
    )
} 