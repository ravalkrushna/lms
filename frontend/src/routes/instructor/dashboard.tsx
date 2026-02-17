import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { InstructorSidebar } from "@/components/InstructorSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import {
  BookOpen,
  Users,
  IndianRupee,
  TrendingUp,
  Clock,
} from "lucide-react"

import { getInstructorStats } from "@/lib/instructor"

export const Route = createFileRoute("/instructor/dashboard")({
  component: InstructorDashboard,
})

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
  iconClass,
  badgeText,
}: {
  label: string
  value: string | number | undefined
  icon: React.ElementType
  isLoading: boolean
  iconClass?: string
  badgeText?: string
}) {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={`p-2 rounded-md bg-muted ${iconClass ?? ""}`}>
            <Icon size={16} />
          </div>
        </div>

        <div className="flex items-end justify-between">
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <p className="text-3xl font-bold tracking-tight">
              {value ?? "0"}
            </p>
          )}
          {badgeText && !isLoading && (
            <Badge variant="secondary" className="text-xs mb-1">
              {badgeText}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

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
      iconClass: "text-sky-600",
      badgeText: data?.totalCourses ? "Active" : undefined,
    },
    {
      label: "Platform Students",
      value: data?.totalStudents,
      icon: Users,
      iconClass: "text-violet-600",
      badgeText: data?.totalStudents ? "Enrolled" : undefined,
    },
    {
      label: "Revenue",
      value: "—",
      icon: IndianRupee,
      iconClass: "text-emerald-600",
      badgeText: "Coming soon",
    },
  ]

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back! Here's an overview of your activity.
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 text-xs">
            <Clock size={12} />
            Live Stats
          </Badge>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} isLoading={isLoading} />
          ))}
        </div>

        <Separator />

        {/* ── Quick Overview Card ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Overview</CardTitle>
                <CardDescription className="mt-1">
                  Your teaching summary at a glance.
                </CardDescription>
              </div>
              <TrendingUp size={18} className="text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            ) : (
              <div className="space-y-3 text-sm text-muted-foreground">

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <BookOpen size={15} className="text-sky-600" />
                    <span>Total Courses Created</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {data?.totalCourses ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-violet-600" />
                    <span>Students on Platform</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {data?.totalStudents ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <IndianRupee size={15} className="text-emerald-600" />
                    <span>Revenue Tracking</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>

              </div>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  )
}