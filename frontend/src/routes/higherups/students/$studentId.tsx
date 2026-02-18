import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { Mail, Phone, MapPin } from "lucide-react"

import { getUserById } from "@/lib/higherups"

export const Route = createFileRoute(
  "/higherups/students/$studentId"
)({
  component: StudentDetail,
})

function StudentDetail() {
  const { studentId } = Route.useParams()

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getUserById(studentId),
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!student) {
    return <div className="p-6">Student not found</div>
  }

  const initials = student.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="p-6 max-w-3xl">

      <Card className="shadow-sm">

        {/* ✅ Header Block */}
        <CardHeader className="flex flex-row items-center gap-4">

          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <CardTitle className="text-xl">
              {student.name}
            </CardTitle>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {student.role}
              </Badge>

              <span className="text-xs text-muted-foreground">
                ID #{student.id}
              </span>
            </div>
          </div>

        </CardHeader>

        <Separator />

        {/* ✅ Content */}
        <CardContent className="pt-5 space-y-4 text-sm">

          <InfoRow
            icon={<Mail size={16} />}
            label="Email"
            value={student.email}
          />

          <InfoRow
            icon={<Phone size={16} />}
            label="Contact"
            value={student.contactNo || "Not provided"}
          />

          <InfoRow
            icon={<MapPin size={16} />}
            label="Address"
            value={student.address || "Not provided"}
          />

        </CardContent>
      </Card>
    </div>
  )
}

/* ✅ Reusable Row Component (Clean & Scalable) */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="text-muted-foreground">
        {icon}
      </div>

      <div className="w-20 text-muted-foreground">
        {label}
      </div>

      <div className="font-medium">
        {value}
      </div>

    </div>
  )
}
