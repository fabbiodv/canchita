'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LinkIcon, PlusIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateCenterDialog } from "@/components/admin/centers/create-center-dialog"
import { fetchUserCenters } from "@/utils/centers"
import { toast } from "sonner"

interface SportCenter {
    id: string
    name: string
    address: string
    isActive: boolean
    createdAt: string
}

interface CenterAdmin {
    id: string
    email: string
    name: string
}

export default function CentersPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [centers, setCenters] = useState<SportCenter[]>([])

    useEffect(() => {
        fetchUserCenters().then((centers) => {
            setCenters(centers)
        })
    }, [])

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <CardTitle>Centros deportivos</CardTitle>
                        <CardDescription>Gestiona los centros deportivos disponibles en la plataforma</CardDescription>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Crear centro
                    </Button>
                </CardHeader>
                <CardContent>
                    {centers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <h3 className="mt-2 text-lg font-semibold">No hay centros deportivos</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Para comenzar a alquilar canchas, primero debes crear un centro deportivo.
                            </p>

                        </div>
                    ) : (
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Creado por</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead className="hidden sm:table-cell">Dirección</TableHead>
                                    <TableHead className="hidden md:table-cell">Estado</TableHead>
                                    <TableHead className="hidden lg:table-cell">Fecha de creación</TableHead>
                                    <TableHead>Compartir Link</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {centers.map((center) => (
                                    <TableRow
                                        key={center.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => {
                                            window.location.href = `/${center.id}`;
                                        }}
                                    >
                                        <TableCell className="font-medium">
                                            {center.owner?.email}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {center.name}
                                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                                {center.address}
                                            </div>
                                            <div className="md:hidden text-xs text-muted-foreground">
                                                {center.isActive ? 'Activo' : 'Inactivo'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{center.address}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${center.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {center.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">{new Date(center.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const url = `${window.location.origin}/${center.id}`;
                                                    navigator.clipboard.writeText(url);
                                                    toast.success('Link copiado al portapapeles');
                                                }}
                                                title="Copiar link del centro"
                                                aria-label="Copiar link del centro"
                                            >
                                                <LinkIcon className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateCenterDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onCreateSuccess={(newCenter) => {
                    setCenters((prev) => [...prev, {
                        ...newCenter,
                        id: newCenter.id.toString(),
                        isActive: true,
                        createdAt: new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' })
                    }])
                    setIsDialogOpen(false)
                }}
            />
        </div>
    )
}