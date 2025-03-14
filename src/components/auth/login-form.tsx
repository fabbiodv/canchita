"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { KeyIcon, MailIcon, UserPlusIcon, ArrowRightIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Esquema para login con magic link
const magicLinkSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
})

// Esquema para login con contraseña
const passwordLoginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
})

// Esquema para registro
const registerSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

type MagicLinkFormValues = z.infer<typeof magicLinkSchema>
type PasswordLoginFormValues = z.infer<typeof passwordLoginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<"magic" | "password">("password")
    const [isRegistering, setIsRegistering] = useState(false)
    // Formulario para magic link
    const magicLinkForm = useForm<MagicLinkFormValues>({
        resolver: zodResolver(magicLinkSchema),
        defaultValues: {
            email: "",
        },
    })

    // Formulario para login con contraseña
    const passwordLoginForm = useForm<PasswordLoginFormValues>({
        resolver: zodResolver(passwordLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // Formulario para registro
    const registerForm = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const handleMagicLinkSubmit = async (values: MagicLinkFormValues) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            })

            if (!response.ok) {
                throw new Error('Error al enviar el magic link')
            }

            toast.success('Link de acceso enviado al email', {
                description: 'No olvides revisar la carpeta de spam'
            })
        } catch (error) {
            console.error(error)
            toast.error('Error al enviar el magic link')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordLogin = async (values: PasswordLoginFormValues) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: values.email,
                    password: values.password
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al iniciar sesión')
            }

            toast.success('Inicio de sesión exitoso', {
                description: 'Redirigiendo...'
            })

            //router.push('/profile')
            window.location.href = '/profile'
        } catch (error) {
            console.error(error)
            toast.error('Error de inicio de sesión', {
                description: error instanceof Error ? error.message : 'Credenciales incorrectas'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (values: RegisterFormValues) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    password: values.password
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al registrarse')
            }

            toast.success('Registro exitoso', {
                description: 'Redirigiendo...'
            })
            // Aquí podríamos redireccionar al usuario
            // window.location.href = '/dashboard'
        } catch (error) {
            console.error(error)
            toast.error('Error de registro', {
                description: error instanceof Error ? error.message : 'No se pudo completar el registro'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleModeToggle = () => {
        setIsRegistering(!isRegistering)
        // Reiniciar formularios al cambiar de modo
        magicLinkForm.reset()
        passwordLoginForm.reset()
        registerForm.reset()
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    {isRegistering ? "Crear una cuenta" : "Iniciar sesión"}
                </CardTitle>
                <CardDescription className="text-center">
                    {isRegistering
                        ? "Registra una nueva cuenta para acceder"
                        : "Inicia sesión para acceder a tu cuenta"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {!isRegistering ? (
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "magic" | "password")} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="password" className="flex items-center gap-2">
                                <KeyIcon className="w-4 h-4" />
                                <span>Contraseña</span>
                            </TabsTrigger>
                            <TabsTrigger value="magic" className="flex items-center gap-2">
                                <MailIcon className="w-4 h-4" />
                                <span>Enviar link a tu mail</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="magic">
                            <Form {...magicLinkForm}>
                                <form onSubmit={magicLinkForm.handleSubmit(handleMagicLinkSubmit)} className="space-y-4">
                                    <FormField
                                        control={magicLinkForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="nombre@ejemplo.com"
                                                        type="email"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="rounded-lg bg-amber-50 p-3 text-sm border border-amber-200">
                                        <p className="text-amber-800">
                                            Te enviaremos un enlace a tu correo para iniciar sesión.
                                            No se requiere contraseña.
                                        </p>
                                    </div>
                                    <Button className="w-full" type="submit" disabled={isLoading}>
                                        {isLoading ? "Enviando..." : "Enviar link"}
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>

                        <TabsContent value="password">
                            <Form {...passwordLoginForm}>
                                <form onSubmit={passwordLoginForm.handleSubmit(handlePasswordLogin)} className="space-y-4">
                                    <FormField
                                        control={passwordLoginForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="nombre@ejemplo.com"
                                                        type="email"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordLoginForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel>Contraseña</FormLabel>

                                                </div>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ingresa tu contraseña"
                                                        type="password"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className="w-full" type="submit" disabled={isLoading}>
                                        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                            <FormField
                                control={registerForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tu nombre"
                                                type="text"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="nombre@ejemplo.com"
                                                type="email"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tu contraseña"
                                                type="password"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Confirma tu contraseña"
                                                type="password"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>

            <CardFooter>
                <div className="w-full space-y-4">
                    <Separator />
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleModeToggle}
                        type="button"
                    >
                        {isRegistering ? (
                            <span className="flex items-center gap-2">
                                <ArrowRightIcon className="w-4 h-4" />
                                Ya tengo una cuenta
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <UserPlusIcon className="w-4 h-4" />
                                Crear una cuenta nueva
                            </span>
                        )}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
