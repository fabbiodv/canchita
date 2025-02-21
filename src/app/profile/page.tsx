'use client'


import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
            </Card>
        </div>
    )
}