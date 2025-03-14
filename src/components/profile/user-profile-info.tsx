"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { MailIcon, UserIcon, PhoneIcon, UserCircleIcon, CheckCircleIcon } from "lucide-react"
import { EditProfileDialog } from "./edit-profile-dialog"

interface UserData {
  id: number
  email: string
  name: string | null
  lastName: string | null
  phone: string | null
  dni: string | null
  status: string
  role: string
  lastLogin: string | null
  createdAt: string
}

export function UserProfileInfo() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('No se pudo obtener la información del usuario')
      }

      const data = await response.json()
      setUserData(data.user)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar datos del perfil', {
        description: 'No se pudo obtener la información de tu perfil'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  // Obtiene las iniciales del nombre para el avatar
  const getInitials = () => {
    if (!userData) return "U"

    const firstInitial = userData.name?.charAt(0) || ''
    const lastInitial = userData.lastName?.charAt(0) || ''

    return (firstInitial + lastInitial).toUpperCase() || userData.email.charAt(0).toUpperCase()
  }

  // Formatea la fecha a un formato legible
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible"

    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[250px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[300px]" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No se pudo cargar el perfil</CardTitle>
          <CardDescription>
            Por favor inicia sesión nuevamente o contacta a soporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/auth'}>
            Volver a iniciar sesión
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de perfil</CardTitle>
        <CardDescription>
          Datos de tu cuenta en Canchita
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border">
            <AvatarFallback className="text-lg bg-primary/10">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">
              {userData.name && userData.lastName
                ? `${userData.name} ${userData.lastName}`
                : userData.email}
            </h3>

          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MailIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Email:</span>
            <span className="flex-1">{userData.email}</span>
            {userData.status === "ACTIVE" && (
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Nombre completo:</span>
            <span>
              {userData.name && userData.lastName
                ? `${userData.name} ${userData.lastName}`
                : "No especificado"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <PhoneIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Teléfono:</span>
            <span>{userData.phone || "No especificado"}</span>
          </div>

          <div className="flex items-center space-x-2">
            <UserCircleIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">DNI:</span>
            <span>{userData.dni || "No especificado"}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Último acceso:</span>
            <span>{formatDate(userData.lastLogin)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cuenta creada el:</span>
            <span>{formatDate(userData.createdAt)}</span>
          </div>
        </div>

        {userData && (
          <EditProfileDialog
            userData={userData}
            onProfileUpdate={fetchUserData}
          />
        )}
      </CardContent>
    </Card>
  )
}