import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { InstructorSidebar } from "@/components/InstructorSidebar"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  BookOpen,
  Users,
  IndianRupee,
} from "lucide-react"

import { getInstructorStats } from "@/lib/instructor"

export const Route = createFileRoute("/instructor/dashboard")({
  component: InstructorDashboard,
})

function InstructorDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["instructor-dashboard-stats"],
    queryFn: getInstructorStats,
  })

  const stats = [
    {
      label: "My Courses",
      value: data?.totalCourses,
      icon: BookOpen,
    },
    {
      label: "Platform Students",
      value: data?.totalStudents,
      icon: Users,
    },
    {
      label: "Revenue",
      value: "—", // future analytics
      icon: IndianRupee,
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
                    {isLoading ? "—" : stat.value ?? "0"}
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
