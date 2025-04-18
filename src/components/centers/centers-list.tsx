'use client'

import { useEffect, useState } from "react"
import { fetchAllCenters } from "@/utils/centers"
import { CenterCard } from "./center-card"
import { Center } from "@/types/center"

export function CentersList() {
    const [centers, setCenters] = useState<Center[]>([]);

    useEffect(() => {
        fetchAllCenters().then(setCenters);
    }, []);

    if (!centers?.length) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">
                    No hay centros deportivos disponibles en este momento.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {centers.map((center: Center) => (
                <CenterCard key={center.id} center={center} />
            ))}
        </div>
    );
}