import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AdminSidebar } from "@/components/AdminSidebar"
import { getAdminProfile } from "@/lib/admin"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/admin/profile")({
  component: AdminProfilePage,
})

function AdminProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfile,
  })

  return (
    <div className="flex min-h-screen bg-background">

      <AdminSidebar />

      <main className="flex-1 p-6">
        {/* ✅ Width Constraint Fix */}
        <div className="max-w-3xl">

          <Card>
            <CardHeader>
              <CardTitle>Admin Profile </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {isLoading && (
                <p className="text-muted-foreground">
                  Loading profile...
                </p>
              )}

              {!isLoading && profile && (
                <div className="space-y-3 text-sm">

                  <ProfileRow label="Name" value={profile.name} />
                  <ProfileRow label="Email" value={profile.email} />
                  <ProfileRow label="Role" value={profile.role} />

                </div>
              )}

            </CardContent>
          </Card>

        </div>
      </main>

    </div>
  )
}

function ProfileRow({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className="flex gap-6 border-b pb-2">

      {/* ✅ Fixed Label Width = Perfect Alignment */}
      <span className="text-muted-foreground w-32 shrink-0">
        {label}
      </span>

      <span className="font-medium">
        {value || "—"}
      </span>

    </div>
  )
}
