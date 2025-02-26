'use client'

import { Suspense, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PencilIcon, PlusIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchFields } from "@/utils/fields"
import { Field } from "@/types/field"
import { fetchUserCenters } from "@/utils/centers"
import { Center } from "@/types/center"
import { CreateFieldDialog } from "@/components/admin/fields/create-field-dialog"
import { EditFieldDialog } from "@/components/admin/fields/edit-field-dialog"
import Link from "next/link"

export default function FieldsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [fields, setFields] = useState<Field[]>([])
    const [centers, setCenters] = useState<Center[]>([])
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedField, setSelectedField] = useState<Field | null>(null)

    useEffect(() => {
        async function loadFields() {
            try {
                const centers = await fetchUserCenters()
                setCenters(centers)

                if (centers.length > 0) {
                    const fields = await fetchFields()
                    setFields(fields)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        loadFields()
    }, [])

    const statusMap = {
        ACTIVE: 'Activa',
        MAINTENANCE: 'En mantenimiento',
        INACTIVE: 'Inactiva'
    }

    const statusColorMap = {
        ACTIVE: 'bg-green-100 text-green-800',
        MAINTENANCE: 'bg-yellow-100 text-yellow-800',
        INACTIVE: 'bg-red-100 text-red-800'
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

    const handleEditSuccess = (updatedField: Field) => {
        setFields(currentFields =>
            currentFields.map(field =>
                field.id === updatedField.id ? updatedField : field
            )
        )
    }

    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <div className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                            <CardTitle>Canchas</CardTitle>
                            <CardDescription>Gestiona las canchas disponibles en tus centros deportivos</CardDescription>
                        </div>
                        {centers.length > 0 ? (
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Crear cancha
                            </Button>
                        ) : null}
                    </CardHeader>
                    <CardContent>
                        {centers.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">
                                    No tienes ningún centro deportivo creado. Crea uno para poder crear canchas.
                                </p>
                                <Button asChild variant="outline">
                                    <Link href="/admin/centers">
                                        Crear centro deportivo
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead className="hidden md:table-cell">Tipo</TableHead>
                                        <TableHead className="hidden md:table-cell">Superficie</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead className="hidden sm:table-cell">Estado</TableHead>
                                        <TableHead className="hidden lg:table-cell">Centro deportivo</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.length > 0 ? fields.map((field) => (
                                        <TableRow key={field.id}>
                                            <TableCell className="font-medium">
                                                {field.name}
                                                <div className="md:hidden text-xs text-muted-foreground mt-1">
                                                    {typeMap[field.type as keyof typeof typeMap]}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{typeMap[field.type as keyof typeof typeMap]}</TableCell>
                                            <TableCell className="hidden md:table-cell">{surfaceMap[field.surface as keyof typeof surfaceMap]}</TableCell>
                                            <TableCell>${field.price}</TableCell>
                                            <TableCell className="hidden sm:table-cell ">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColorMap[field.status as keyof typeof statusColorMap]}`}>
                                                    {statusMap[field.status as keyof typeof statusMap]}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">{centers.find(c => c.id === field.centerId)?.name}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedField(field)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                    aria-label="Editar cancha"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : <TableRow><TableCell colSpan={7} className="text-center">No hay canchas disponibles</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <CreateFieldDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    centers={centers}
                    fields={fields}
                    onCreateSuccess={(newField) => {
                        setFields(currentFields => Array.isArray(currentFields) ? [...currentFields, newField] : [newField]);
                    }}
                />

                <EditFieldDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    field={selectedField}
                    centers={centers}
                    onEditSuccess={handleEditSuccess}
                />
            </div>
        </Suspense>
    )
}