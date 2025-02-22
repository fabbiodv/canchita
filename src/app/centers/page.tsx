import { Suspense } from "react"
import { CentersList } from "@/components/centers/centers-list"

export default function CentersPage() {
    return (
        <div className="container mx-auto py-6 space-y-6 px-2">
            <h1 className="text-2xl font-bold">Centros Deportivos</h1>
            <Suspense fallback={<div>Cargando centros...</div>}>
                <CentersList />
            </Suspense>
        </div>
    )
}