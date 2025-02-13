'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateCenterDialog } from "@/components/admin/centers/create-center-dialog"

interface SportCenter {
    id: string
    name: string
    address: string
    isActive: boolean
    createdAt: string
}

export default function CentersPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [centers, setCenters] = useState<SportCenter[]>([])

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Dirección</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha de creación</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {centers.map((center) => (
                                <TableRow key={center.id}>
                                    <TableCell>{center.name}</TableCell>
                                    <TableCell>{center.address}</TableCell>
                                    <TableCell>{center.isActive ? 'Activo' : 'Inactivo'}</TableCell>
                                    <TableCell>{new Date(center.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <CreateCenterDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onCreateSuccess={(newCenter) => {
                    setCenters((prev) => [...prev, newCenter])
                    setIsDialogOpen(false)
                }}
            />
        </div>
    )
}