'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2, UserPlus } from "lucide-react"
import { AddCenterAdminDialog } from "@/components/admin/center-admins/add-center-admin-dialog"
import { CenterAdmin, deleteCenterAdmin, getMyCentersAdmins } from "@/utils/center-admins"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Center } from "@/types/center"
import { fetchUserCenters } from "@/utils/centers"

// Mapeo de permisos para mostrar etiquetas más amigables
const PERMISSION_LABELS: Record<string, string> = {
    "VIEW_BOOKINGS": "Ver reservas",
    "MANAGE_BOOKINGS": "Gestionar reservas",
    "MANAGE_FIELDS": "Gestionar canchas",
    "MANAGE_CENTER": "Gestionar centro",
    "FULL_ACCESS": "Acceso completo"
}

// Colores para los badges de permisos
const PERMISSION_COLORS: Record<string, string> = {
    "VIEW_BOOKINGS": "bg-blue-100 text-blue-800",
    "MANAGE_BOOKINGS": "bg-green-100 text-green-800",
    "MANAGE_FIELDS": "bg-amber-100 text-amber-800",
    "MANAGE_CENTER": "bg-purple-100 text-purple-800",
    "FULL_ACCESS": "bg-red-100 text-red-800"
}

export default function CenterAdminsPage() {

    const [admins, setAdmins] = useState<CenterAdmin[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [adminToDelete, setAdminToDelete] = useState<CenterAdmin | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [centers, setCenters] = useState<Center[]>([])

    useEffect(() => {
        async function loadCenters() {
            const centers = await fetchUserCenters()
            setCenters(centers)
        }
        loadCenters()
        loadAdmins()
    }, [])

    const loadAdmins = async () => {

        setIsLoading(true)
        try {
            const data = await getMyCentersAdmins()
            setAdmins(data)

        } catch (error) {
            console.error('Error al cargar administradores:', error)
        } finally {
            setIsLoading(false)
        }

    }

    const handleDeleteAdmin = async () => {
        if (!adminToDelete) return

        try {
            const success = await deleteCenterAdmin(adminToDelete.id)
            if (success) {
                setAdmins(admins.filter(admin => admin.id !== adminToDelete.id))
                toast.success('Administrador eliminado correctamente')
            }
        } catch (error) {
            console.error('Error al eliminar administrador:', error)
        } finally {
            setIsDeleteDialogOpen(false)
            setAdminToDelete(null)
        }
    }

    const confirmDelete = (admin: CenterAdmin) => {
        setAdminToDelete(admin)
        setIsDeleteDialogOpen(true)
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle>Administradores del Centro</CardTitle>
                        <CardDescription>
                            Gestiona quién puede administrar este centro deportivo
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Añadir administrador
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <p className="text-muted-foreground">Cargando administradores...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Centro deportivo</TableHead>
                                    <TableHead>Permisos</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.length > 0 ? (
                                    admins.map((admin) => (
                                        <TableRow key={admin.id}>
                                            <TableCell className="font-medium">
                                                {admin.user.email}
                                                <div className="md:hidden text-xs text-muted-foreground mt-1">
                                                    {admin.user.name} {admin.user.lastName}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {centers.find(center => center.id === admin.centerId)?.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {admin.permissions.map(permission => (
                                                        <Badge
                                                            key={permission}
                                                            variant="outline"
                                                            className={`${PERMISSION_COLORS[permission]} text-xs`}
                                                        >
                                                            {PERMISSION_LABELS[permission] || permission}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => confirmDelete(admin)}
                                                        title="Eliminar administrador"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                            No hay administradores para este centro deportivo
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <AddCenterAdminDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAddSuccess={loadAdmins}
                centers={centers}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará a {adminToDelete?.user.email} como administrador de este centro deportivo.
                            Esta acción no puede deshacerse.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAdmin} className="bg-red-600 hover:bg-red-700 dark:text-white">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
