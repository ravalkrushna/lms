import { createFileRoute } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AdminSidebar } from "@/components/AdminSidebar"

import {
  BookOpen,
  Users,
  BarChart3,
} from "lucide-react"

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
})

function AdminDashboard() {
 type StatColor = "indigo" | "violet" | "cyan"

type StatItem = {
  label: string
  value: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  color: StatColor
}

const stats: StatItem[] = [
  {
    label: "Total Courses",
    value: "24",
    icon: BookOpen,
    color: "indigo",
  },
  {
    label: "Active Students",
    value: "128",
    icon: Users,
    color: "violet",
  },
  {
    label: "Platform Growth",
    value: "+18%",
    icon: BarChart3,
    color: "cyan",
  },
]


  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ✅ Welcome Banner */}
        <Card className="bg-linear-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 border-indigo-500/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">
              Welcome back, Admin 👋
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage your LMS efficiently 🚀
            </p>
          </CardContent>
        </Card>

        {/* ✅ Stats Section */}
        <div className="grid gap-4 md:grid-cols-3">

          {stats.map(stat => {
            const Icon = stat.icon

            const colors = {
              indigo: "bg-indigo-500/10 text-indigo-600",
              violet: "bg-violet-500/10 text-violet-600",
              cyan: "bg-cyan-500/10 text-cyan-600",
            }

            return (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">

                  <div className={`p-2 rounded-md ${colors[stat.color]}`}>
                    <Icon size={18} />
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className="text-xl font-semibold">
                      {stat.value}
                    </div>
                  </div>

                </CardContent>
              </Card>
            )
          })}

        </div>

        {/* ✅ Placeholder Panel */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview 📊</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Analytics, reports, and activity insights will appear here.
          </CardContent>
        </Card>

      </main>
    </div>
  )
}
