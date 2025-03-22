import { useState, useEffect } from "react"
import { Field } from "@/types/field"
import { fetchFieldsByCenterId } from "@/utils/fields"

export function useBookingFields(centerId: string) {
    const [selectedField, setSelectedField] = useState<Field | null>(null)
    const [fields, setFields] = useState<Field[]>([])

    useEffect(() => {
        const loadFields = async () => {
            const response = await fetchFieldsByCenterId(centerId)
            setFields(response)
        }
        loadFields()
    }, [centerId])

    const handleFieldSelect = (field: Field) => {
        setSelectedField(field)
    }

    const handleResetSelection = () => {
        setSelectedField(null)
    }

    return {
        fields,
        selectedField,
        setSelectedField,
        handleFieldSelect,
        handleResetSelection
    }
} 