import { Card, CardContent } from "@/components/ui/card"
import { Field } from "@/types/field"
import { formatFieldType, formatSurfaceType } from "@/utils/formatFields"

interface FieldSelectionProps {
    fields: Field[]
    onFieldSelect: (field: Field) => void
}

export function FieldSelection({ fields, onFieldSelect }: FieldSelectionProps) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Selecciona una cancha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                    <Card
                        key={field.id}
                        className="overflow-hidden cursor-pointer hover:border-primary"
                        onClick={() => onFieldSelect(field)}
                    >
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg">{formatFieldType(field.type)}</h3>
                            <p className="text-sm text-muted-foreground">Superficie: {formatSurfaceType(field.surface)}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 