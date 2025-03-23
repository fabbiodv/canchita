import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Field } from "@/types/field"
import { Center } from "@/types/center"
import { formatFieldType, formatSurfaceType } from "@/utils/formatFields"
import dayjs from "dayjs"
import { TimeSlot, BookingStatus } from "@/types/booking"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react"

// Importar el esquema compartido
import { bookingFormSchema, BookingFormValues } from "./booking-form-types"

interface User {
    email?: string
    name?: string
    lastName?: string
    dni?: string
}

interface BookingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    bookingStep: number
    setBookingStep: (step: number) => void
    selectedField: Field | null
    selectedDate: string | null
    selectedTime: string | null
    timeSlots: TimeSlot[]
    center: Center
    user: User | null
    bookingStatus: BookingStatus
    isSubmitting: boolean
    onSubmit: (formData: BookingFormValues) => Promise<void>
}

export function BookingDialog({
    open,
    onOpenChange,
    bookingStep,
    setBookingStep,
    selectedField,
    selectedDate,
    selectedTime,
    timeSlots,
    center,
    user,
    bookingStatus,
    isSubmitting,
    onSubmit
}: BookingDialogProps) {
    // Inicializar formulario con valores por defecto
    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            name: user?.name || "",
            lastName: user?.lastName || "",
            dni: user?.dni || "",
            phone: "",
            paymentMethod: "cash",
        },
    })

    // Actualizar valores del formulario cuando cambia el usuario
    useEffect(() => {
        if (user) {
            // Establecer los valores del usuario en el formulario
            if (user.name) form.setValue("name", user.name);
            if (user.lastName) form.setValue("lastName", user.lastName);
            if (user.dni) form.setValue("dni", user.dni);
        }
    }, [user, form]);

    // Manejar la navegación entre pasos
    const handleContinue = async () => {
        const isValid = await form.trigger();
        if (isValid) {
            setBookingStep(2);
        }
    };

    // Manejar el envío del formulario
    const handleSubmit = form.handleSubmit(async (data) => {
        await onSubmit(data);
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Reservar Cancha</DialogTitle>
                    <DialogDescription>
                        {selectedField && selectedDate && selectedTime && (
                            <span className="text-sm text-muted-foreground">
                                <span className="font-bold">{formatFieldType(selectedField.type)}</span> -
                                <span className="text-muted-foreground"> {formatSurfaceType(selectedField.surface)}</span>
                                <span className="text-muted-foreground"> Fecha: {dayjs(selectedDate).format('DD MMMM YYYY')} a las {selectedTime}</span>
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {bookingStatus.message && (
                    <div className={`p-3 rounded-md mb-4 ${bookingStatus.success ? 'bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300'}`}>
                        {bookingStatus.message}
                    </div>
                )}

                <Form {...form}>
                    {bookingStep === 1 && (
                        <div className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            {user?.name ? (
                                                <Input
                                                    value={user.name}
                                                    disabled
                                                    onChange={field.onChange}
                                                />
                                            ) : (
                                                <Input
                                                    placeholder="Ingresa tu nombre"
                                                    {...field}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                            {user?.lastName ? (
                                                <Input
                                                    value={user.lastName}
                                                    disabled
                                                    onChange={field.onChange}
                                                />
                                            ) : (
                                                <Input
                                                    placeholder="Ingresa tu apellido"
                                                    {...field}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dni"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>DNI</FormLabel>
                                        <FormControl>
                                            {user?.dni ? (
                                                <Input
                                                    value={user.dni}
                                                    disabled
                                                    onChange={field.onChange}
                                                />
                                            ) : (
                                                <Input
                                                    placeholder="Ingresa tu DNI"
                                                    {...field}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="11 1234-5678"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input value={user?.email || ""} disabled />
                            </div>
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Método de pago</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="cash" id="cash" />
                                                    <Label htmlFor="cash">Efectivo en el lugar</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {bookingStep === 2 && (
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg border p-4 space-y-2">
                                <h4 className="font-medium">Resumen de la reserva</h4>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                    <div className="text-muted-foreground">Cancha:</div>
                                    <div>{formatFieldType(selectedField?.type ?? '')} - {formatSurfaceType(selectedField?.surface ?? '')}</div>
                                    <div className="text-muted-foreground">Fecha:</div>
                                    <div>{dayjs(selectedDate).format('dddd DD [de] MMMM [de] YYYY')}</div>
                                    <div className="text-muted-foreground">Hora:</div>
                                    <div>{selectedTime}</div>
                                    <div className="text-muted-foreground">Duración:</div>
                                    <div>1 hora</div>
                                    <div className="text-muted-foreground">Centro:</div>
                                    <div>{center?.name}</div>
                                    <div className="text-muted-foreground">Dirección:</div>
                                    <div>{center?.address}</div>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between font-medium">
                                        <span>Total:</span>
                                        <span>${timeSlots.find(slot => slot.time === selectedTime)?.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <h4 className="font-medium mb-2">Información 🚧</h4>
                                <p className="text-sm text-muted-foreground">
                                    Una vez enviada la solicitud, tendras que esperar a que el dueño del centro confirme la reserva.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {bookingStep === 1 ? (
                            <Button type="button" onClick={handleContinue}>Continuar</Button>
                        ) : (
                            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                                <Button type="button" variant="outline" onClick={() => setBookingStep(1)} disabled={isSubmitting}>
                                    Volver
                                </Button>
                                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Confirmar Reserva'
                                    )}
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 