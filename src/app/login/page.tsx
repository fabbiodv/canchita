import { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
    title: "Iniciar Sesión",
    description: "Inicia sesión con magic link",
}

export default function LoginPage() {
    return (
        <main className="min-h-[calc(100vh-6rem)] grid place-items-center p-4">
            <LoginForm />
        </main>
    )
}
