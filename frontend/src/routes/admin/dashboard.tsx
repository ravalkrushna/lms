import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { AdminSidebar } from "@/components/AdminSidebar"

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
  GraduationCap,
  TrendingUp,
  Activity,
  ShieldCheck,
  Clock,
  BarChart3,
} from "lucide-react"

import { getAllCourses, getAllUsers } from "@/lib/admin"

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
})

/* ── Static recent activity ── */
const RECENT_ACTIVITY = [
  { title: "New student enrolled",    time: "2 minutes ago",  type: "user"     },
  { title: "Course published",        time: "15 minutes ago", type: "course"   },
  { title: "Assignment submitted",    time: "1 hour ago",     type: "activity" },
  { title: "New instructor joined",   time: "3 hours ago",    type: "user"     },
  { title: "Course content updated",  time: "5 hours ago",    type: "course"   },
]

/* ── Progress rows ── */
const PROGRESS_ROWS = [
  { label: "Active Courses",       pct: 85, color: "bg-primary"        },
  { label: "Student Engagement",   pct: 92, color: "bg-emerald-500"    },
  { label: "Instructor Activity",  pct: 78, color: "bg-sky-500"        },
  { label: "Course Completion",    pct: 73, color: "bg-violet-500"     },
]

/* ── Dot color per activity type ── */
const DOT: Record<string, string> = {
  user:     "bg-sky-500",
  course:   "bg-violet-500",
  activity: "bg-emerald-500",
}

function AdminDashboard() {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: getAllCourses,
  })

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  })

  const isLoading = coursesLoading || usersLoading

  const totalCourses     = courses?.length ?? 0
  const totalStudents    = users?.filter(u => u.role === "STUDENT").length    ?? 0
  const totalInstructors = users?.filter(u => u.role === "INSTRUCTOR").length ?? 0
  const totalUsers       = users?.length ?? 0

  const stats = [
    { label: "Total Courses",   value: totalCourses,     icon: BookOpen,     change: "+12%" },
    { label: "Students",        value: totalStudents,    icon: GraduationCap,change: "+8%"  },
    { label: "Instructors",     value: totalInstructors, icon: ShieldCheck,  change: "+5%"  },
    { label: "Platform Growth", value: "+18%",           icon: TrendingUp,   change: "This month" },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ── Welcome Banner ── */}
        <Card className="border-0 bg-primary text-primary-foreground shadow-md">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Welcome back, Admin 👋</h2>
              <p className="text-primary-foreground/70 text-sm mt-0.5">
                Here's what's happening on your platform today.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-primary-foreground/70 text-sm">
              <Clock size={15} />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Stat Cards ── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, change }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <p className="text-3xl font-bold tracking-tight">{value}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Two col layout ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── System Overview ── */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 size={16} className="text-primary" />
                    System Overview
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Platform health and engagement metrics.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1.5 text-emerald-600 bg-emerald-50 border-emerald-200">
                  <Activity size={11} />
                  Live
                </Badge>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-5 space-y-6">

              {/* Quick stats mini grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Users",      value: isLoading ? null : totalUsers,       color: "text-sky-600",    bg: "bg-sky-50 border-sky-200"    },
                  { label: "Completion Rate",  value: "73%",                               color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
                  { label: "Avg. Rating",      value: "4.8★",                              color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200" },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`rounded-lg border p-3 ${bg}`}>
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    {value === null ? (
                      <Skeleton className="h-7 w-12" />
                    ) : (
                      <p className={`text-xl font-bold ${color}`}>{value}</p>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Progress bars */}
              <div className="space-y-4">
                {PROGRESS_ROWS.map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold text-foreground">{pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* ── Recent Activity ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription className="mt-1">
                Latest actions on the platform.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4 space-y-1">
              {RECENT_ACTIVITY.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${DOT[item.type]}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            <Separator />

            {/* Summary footer */}
            <CardContent className="py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users size={12} />
                  {isLoading ? "—" : `${totalUsers} total users`}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={12} />
                  {isLoading ? "—" : `${totalCourses} courses`}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}