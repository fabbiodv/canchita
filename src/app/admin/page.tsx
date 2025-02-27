'use client'


import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="mx-4">
                <CardHeader>
                    <CardTitle>Administrador</CardTitle>
                    <CardDescription>
                        Aquí puedes gestionar los centros de deportes, canchas y reservas.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}