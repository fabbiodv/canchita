'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LandPlot,
    MapPin,
    Calendar,
    User,
    LayoutDashboard
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
import React from "react"

const sidebarItems = [
    {
        title: "Centros de deportes",
        href: "/admin/centers",
        icon: MapPin,
    },
    {
        title: "Canchas",
        href: "/admin/fields",
        icon: LandPlot,
    },
    {
        title: "Reservas",
        href: "/admin/reservas",
        icon: Calendar,
    },
    {
        title: "Perfiles",
        href: "/admin/perfiles",
        icon: User,
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

function SidebarContent() {
    const pathname = usePathname()

    return (
        <div className="space-y-4">
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold">Administrador</h2>
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn("w-full justify-start")}
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

export function AdminSidebar() {
    const [open, setOpen] = React.useState(false)
    const pathname = usePathname();

    return (
        <>
            {/* Versión móvil */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="lg:hidden fixed left-3 top-6">
                    <Button variant="outline" size="icon">
                        <LayoutDashboard className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Panel de Administración</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4">
                        <div className="px-3 py-2">
                            <h2 className="mb-2 px-4 text-lg font-semibold">Administrador</h2>
                            <div className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <Button
                                        key={item.href}
                                        variant={pathname === item.href ? "secondary" : "ghost"}
                                        className={cn("w-full justify-start")}
                                        asChild
                                        onClick={() => setOpen(false)}
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