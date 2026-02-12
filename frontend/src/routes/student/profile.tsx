import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AppShell } from "@/components/AppShell"
import { getStudentProfile } from "@/lib/student"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/student/profile")({
  component: StudentProfile,
})

function StudentProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["student-profile"],
    queryFn: getStudentProfile,
  })

  return (
    <AppShell title="My Profile 👤">

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          {isLoading && (
            <p className="text-muted-foreground">
              Loading profile...
            </p>
          )}

          {!isLoading && profile && (
            <div className="space-y-2 text-sm">

              <ProfileRow label="Name" value={profile.name} />
              <ProfileRow label="Email" value={profile.email} />
              <ProfileRow label="Contact No" value={profile.contactNo} />
              <ProfileRow label="Address" value={profile.address} />

            </div>
          )}

        </CardContent>
      </Card>

    </AppShell>
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
    <div className="flex justify-between border-b pb-2">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium">
        {value || "—"}
      </span>
    </div>
  )
}
