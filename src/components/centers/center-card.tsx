import { Center } from "@/types/center"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

interface CenterCardProps {
    center: Center
}

export function CenterCard({ center }: CenterCardProps) {
    return (
        <Link href={`/${center.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                </CardHeader>
                <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{center.name}</h3>
                    <p className="mt-2 text-sm">{center.address}</p>
                </CardContent>
            </Card>
        </Link>
    )
}