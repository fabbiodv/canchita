"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
})

interface LoginFormValues extends z.infer<typeof formSchema> {
    isSubmitting?: boolean
}

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: LoginFormValues) {
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

            const data = await response.json()
            console.log(data)
            toast.success('Link de acceso enviado al email')
        } catch (error) {
            console.error(error)
            toast.error('Error al enviar el magic link')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
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
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <span>Enviando...</span>
                    ) : (
                        <span>Enviar link</span>
                    )}
                </Button>
            </form>
        </Form>
    )
}
