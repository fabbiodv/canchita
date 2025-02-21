'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchFields } from "@/utils/fields"
import { Field } from "@/types/field"
import { fetchUserCenters } from "@/utils/centers"
import { Center } from "@/types/center"
import { CreateFieldDialog } from "@/components/admin/fields/create-field-dialog"


export default function FieldsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [fields, setFields] = useState<Field[]>([])
    const [centers, setCenters] = useState<Center[]>([])
    useEffect(() => {
        fetchFields().then((fields) => {
            setFields(fields)
        })

        fetchUserCenters().then((centers) => {
            setCenters(centers)
        })
    }, [])

    const statusMap = {
        ACTIVE: 'Activa',
        MAINTENANCE: 'En mantenimiento',
        INACTIVE: 'Inactiva'
    }

    const typeMap = {
        FUTBOL_5: 'Fútbol 5',
        FUTBOL_7: 'Fútbol 7',
        FUTBOL_8: 'Fútbol 8',
    }

    const surfaceMap = {
        SYNTHETIC_GRASS: 'Césped sintético',
        NATURAL_GRASS: 'Césped natural',
        HARD_COURT: 'Pista dura',
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Canchas</CardTitle>
                        <CardDescription>Gestiona las canchas disponibles en tus centros deportivos</CardDescription>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Crear cancha
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Superficie</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Centro deportivo</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field) => (
                                <TableRow key={field.id}>
                                    <TableCell>{field.name}</TableCell>
                                    <TableCell>{typeMap[field.type as keyof typeof typeMap]}</TableCell>
                                    <TableCell>{surfaceMap[field.surface as keyof typeof surfaceMap]}</TableCell>
                                    <TableCell>${field.price}</TableCell>
                                    <TableCell>{statusMap[field.status]}</TableCell>
                                    <TableCell>{centers.find(c => c.id === field.centerId)?.name}</TableCell>
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

            <CreateFieldDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                centers={centers}
                fields={fields}
                onCreateSuccess={(newField) => {
                    setFields((prev) => [...prev, newField])
                }}
            />
        </div >
    )
}