import { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Iniciar Sesión",
    description: "Inicia sesión con magic link",
}

export default function LoginPage() {
    return (
        <main className="min-h-screen grid place-items-center p-4">
            <Card className="w-full max-w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle>Bienvenido de nuevo</CardTitle>
                    <CardDescription>
                        Ingresa tu correo electrónico para recibir un enlace para iniciar sesión
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </main>
    )
}
