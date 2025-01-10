'use client'

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function ConnectMercadoPago() {
    const { user } = useAuth()


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

            console.log(response)

            const data = await response.json()

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
        <div className="space-y-4 container mx-auto">
            <h2 className="text-xl font-semibold">Conectar MercadoPago</h2>
            <p className="text-sm text-gray-600">
                Conecta tu cuenta de MercadoPago para recibir pagos por las reservas.
            </p>
            {user?.mpAccessToken ? (
                <div className="flex items-center gap-2">
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
        </div>
    )
}