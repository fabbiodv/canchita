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
    onSubmit: () => Promise<void>
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

                {bookingStep === 1 && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            {user?.name ? (
                                <Input id="name" placeholder={user.name} disabled />
                            ) : (
                                <Input id="name" placeholder="Ingresa tu nombre" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastname">Apellido</Label>
                            {user?.lastName ? (
                                <Input id="lastname" placeholder={user.lastName} disabled />
                            ) : (
                                <Input id="lastname" placeholder="Ingresa tu apellido" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dni">DNI</Label>
                            {user?.dni ? (
                                <Input id="dni" placeholder={user.dni} disabled />
                            ) : (
                                <Input id="dni" placeholder="Ingresa tu DNI" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" placeholder="11 1234-5678" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input placeholder={user?.email} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Método de pago</Label>
                            <RadioGroup defaultValue="cash">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cash" id="cash" />
                                    <Label htmlFor="cash">Efectivo en el lugar</Label>
                                </div>
                            </RadioGroup>
                        </div>
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
                        <Button onClick={() => setBookingStep(2)}>Continuar</Button>
                    ) : (
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                            <Button variant="outline" onClick={() => setBookingStep(1)} disabled={isSubmitting}>
                                Volver
                            </Button>
                            <Button onClick={onSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 