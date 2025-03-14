'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import PasswordChangeDialog from "@/components/profile/password-change-dialog"
import { UserProfileInfo } from "@/components/profile/user-profile-info"
import { LockIcon } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="w-full max-w-4xl mx-auto py-6 space-y-6">
            <UserProfileInfo />

            <Card className="">
                <CardHeader>
                    <CardTitle>Seguridad</CardTitle>
                    <CardDescription>
                        Configura opciones de seguridad para tu cuenta.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Contraseña</h3>
                                <p className="text-sm text-muted-foreground">
                                    Actualiza tu contraseña para proteger tu cuenta.
                                </p>
                            </div>
                            <PasswordChangeDialog
                                trigger={
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <LockIcon size={16} />
                                        <span>Cambiar contraseña</span>
                                    </Button>
                                }
                            />
                        </div>

                        <Separator />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}