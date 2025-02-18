'use client'

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchUserCenters } from "@/utils/centers"
import { Center } from "@/types/center"

export default function FieldsPage() {

    const [centers, setCenters] = useState<Center[]>([])

    useEffect(() => {
        fetchUserCenters().then((centers) => {
            setCenters(centers)
        })
    }, [])

    console.log(centers)

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Para crear canchas, primero debes crear un centro de deportes</CardTitle>
                </CardHeader>
            </Card>

        </>
    )
}