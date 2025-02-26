'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Field {
    id: number
    name: string
    type: string
    price: number
}

interface SelectorCanchaProps {
    fields: Field[]
    selectedField: string
    onFieldSelect: (value: string) => void
    disabled: boolean
}

export const SelectorCancha = ({
    fields,
    selectedField,
    onFieldSelect,
    disabled
}: SelectorCanchaProps) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">
                Seleccionar Cancha
            </label>
            <Select
                onValueChange={onFieldSelect}
                value={selectedField}
                disabled={disabled}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Elige una cancha" />
                </SelectTrigger>
                <SelectContent>
                    {Array.isArray(fields) && fields.length > 0 ? (
                        fields.map((field) => (
                            <SelectItem
                                key={field.id}
                                value={field.id.toString()}
                            >
                                {field.name} - {field.type} (${field.price})
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="no-fields" disabled>
                            No hay canchas disponibles
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}
