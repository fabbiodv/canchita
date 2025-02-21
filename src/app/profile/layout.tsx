import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProtectedRoute } from "@/utils/protected-route"
export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen">
                <ProfileSidebar />
                <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    )
}