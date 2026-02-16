import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { InstructorSidebar } from "@/components/InstructorSidebar"

import {
  BookOpen,
  Users,
  TrendingUp,
} from "lucide-react"

import { getInstructorCourses } from "@/lib/instructor"

export const Route = createFileRoute("/instructor/dashboard")({
  component: InstructorDashboard,
})

function InstructorDashboard() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: getInstructorCourses,
  })

  const totalCourses = courses?.length ?? 0

  const totalStudents =
    courses?.reduce((acc, c) => acc + (c.enrollments ?? 0), 0) ?? 0

  const stats = [
    {
      label: "My Courses",
      value: totalCourses,
      icon: BookOpen,
    },
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
    },
    {
      label: "Completion Rate",
      value: "—", // analytics later
      icon: TrendingUp,
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <InstructorSidebar />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(stat => {
            const Icon = stat.icon

            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <Icon size={18} />
                  </div>

                  <p className="text-3xl font-bold mt-2">
                    {isLoading ? "—" : stat.value}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
