'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import PasswordChangeDialog from "@/components/profile/password-change-dialog"
import { LockIcon } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="mx-4">
                <CardHeader>
                    <CardTitle>Perfil</CardTitle>
                    <CardDescription>
                        Aquí puedes gestionar tu perfil.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Seguridad</h3>
                                <p className="text-sm text-muted-foreground">
                                    Configura opciones de seguridad para tu cuenta.
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

                        {/* Aquí puedes añadir más secciones del perfil */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}