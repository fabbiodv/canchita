import { TimeSlot } from "@/types/booking";
import { startOfDay } from "date-fns"
import dayjs from "dayjs";

export const isDateDisabled = (date: Date) => {
    // Obtener fecha actual en Argentina
    const now = new Date();

    // Ajustar a zona horaria Argentina (UTC-3)
    const argentinaOffset = -3 * 60; // -3 horas en minutos
    const nowInArgentina = new Date(now.getTime() + (now.getTimezoneOffset() + argentinaOffset) * 60000);

    // Normalizar las fechas al inicio del día para comparación
    const todayStart = startOfDay(nowInArgentina);
    const dateToCheckStart = startOfDay(date);

    // Solo deshabilitar si es un día anterior
    return dateToCheckStart < todayStart;
}

// Función para formatear fechas ISO a formato DD/MM/YYYY
export function formatDate(isoDate: string): string {
    if (!isoDate) return '';

    // Extraer solo la parte de la fecha (YYYY-MM-DD) para evitar problemas de zona horaria
    const datePart = isoDate.split('T')[0];
    const [year, month, day] = datePart.split('-');

    // Retornar en formato DD/MM/YYYY
    return `${day}/${month}/${year}`;
}

export const checkSlotStatus = (date: string, slot: TimeSlot) => {
    // Obtener fecha actual en Argentina
    const now = new Date()
    const argentinaOffset = -3 * 60 // -3 horas en minutos
    const nowInArgentina = new Date(now.getTime() + (now.getTimezoneOffset() + argentinaOffset) * 60000)
    
    // Si slot.time es solo una hora (HH:mm), crear una fecha completa para hoy
    const [hours, minutes] = slot.time.split(':').map(Number)
    const slotDate = dayjs(date).set('hour', hours).set('minute', minutes).toDate()
    const timeDiff = (slotDate.getTime() - nowInArgentina.getTime()) / (1000 * 60 * 60)
    return slotDate <= nowInArgentina || timeDiff <= 1
}