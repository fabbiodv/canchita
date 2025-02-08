'use client'

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConnectMercadoPago() {
    const { user } = useAuth()
    console.log(user)
    const handleConnect = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/auth/connect-mercadopago`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            const data = await response.json()
            console.log(data)

            if (!data.authUrl) {
                throw new Error("URL de autorización no recibida");
            }

            window.location.href = data.authUrl;
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al conectar con MercadoPago. Por favor, intenta nuevamente.');
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="mx-4">
                <CardHeader>
                    <CardTitle>Conectar MercadoPago</CardTitle>
                    <CardDescription>
                        Conecta tu cuenta de MercadoPago para recibir pagos por las reservas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {user?.mpAccessToken ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <span className="text-sm text-green-600">✓ Cuenta conectada</span>
                            <Button variant="outline" onClick={handleConnect}>
                                Reconectar cuenta
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleConnect}>
                            Conectar MercadoPago
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}