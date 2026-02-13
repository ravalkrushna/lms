import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
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
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react"
import { getAllCourses } from "@/lib/admin"
import { getAllUsers } from "@/lib/admin"

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
})

function AdminDashboard() {
  /* ✅ Queries */
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: getAllCourses,
  })

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  })

  /* ✅ Derived Stats */
  const totalCourses = courses?.length ?? 0
  const totalStudents = users?.filter(u => u.role === "STUDENT").length ?? 0
  const totalInstructors = users?.filter(u => u.role === "INSTRUCTOR").length ?? 0
  const growth = "+18%" // placeholder until analytics added

  const stats = [
    {
      label: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-500/10",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Active Students",
      value: totalStudents,
      icon: Users,
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-500/10",
      change: "+8%",
      trend: "up",
    },
    {
      label: "Instructors",
      value: totalInstructors,
      icon: Activity,
      color: "from-emerald-500/20 to-emerald-600/20",
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      change: "+5%",
      trend: "up",
    },
    {
      label: "Platform Growth",
      value: growth,
      icon: TrendingUp,
      color: "from-amber-500/20 to-amber-600/20",
      iconColor: "text-amber-600",
      bgColor: "bg-amber-500/10",
      change: "This month",
      trend: "neutral",
    },
  ] as const

  const recentActivity = [
    { title: "New student enrolled", time: "2 minutes ago", type: "user" },
    { title: "Course published", time: "15 minutes ago", type: "course" },
    { title: "Assignment submitted", time: "1 hour ago", type: "activity" },
    { title: "New instructor joined", time: "3 hours ago", type: "user" },
  ]

  const isLoading = coursesLoading || usersLoading

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <AdminSidebar />
      
      <main className="flex-1 p-6 space-y-6">
        {/* ✅ Welcome Banner with gradient and animation */}
        <Card className="relative overflow-hidden border-none shadow-lg bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 animate-in fade-in slide-in-from-left duration-700 delay-100">
                  Welcome back, Admin 👋
                </h2>
                <p className="text-blue-100 animate-in fade-in slide-in-from-left duration-700 delay-200">
                  Here's what's happening with your platform today
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 animate-in fade-in slide-in-from-right duration-700 delay-300">
                <Clock className="w-5 h-5" />
                <span className="text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ✅ Stats Section with staggered animations */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card 
                key={stat.label}
                className="group relative overflow-hidden border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    {stat.trend !== "neutral" && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {isLoading ? (
                        <span className="inline-block w-16 h-8 bg-slate-200 rounded animate-pulse" />
                      ) : (
                        <span className="tabular-nums">{stat.value}</span>
                      )}
                    </p>
                    {stat.trend === "neutral" && (
                      <p className="text-xs text-slate-500">{stat.change}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ✅ Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* System Overview - takes 2 columns */}
          <Card className="lg:col-span-2 border-slate-200/60 shadow-sm animate-in fade-in slide-in-from-left duration-700 delay-500">
            <CardHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-transparent">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-linear-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                    <p className="text-sm text-slate-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {isLoading ? (
                        <span className="inline-block w-12 h-7 bg-blue-200 rounded animate-pulse" />
                      ) : (
                        users?.length ?? 0
                      )}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-linear-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
                    <p className="text-sm text-slate-600 mb-1">Completion Rate</p>
                    <p className="text-2xl font-bold text-purple-700">73%</p>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Active Courses</span>
                      <span className="font-medium text-slate-900">85%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full animate-in slide-in-from-left duration-1000 delay-700"
                        style={{ width: '85%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Student Engagement</span>
                      <span className="font-medium text-slate-900">92%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-purple-500 to-purple-600 rounded-full animate-in slide-in-from-left duration-1000 delay-800"
                        style={{ width: '92%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Instructor Activity</span>
                      <span className="font-medium text-slate-900">78%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 rounded-full animate-in slide-in-from-left duration-1000 delay-900"
                        style={{ width: '78%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-slate-200/60 shadow-sm animate-in fade-in slide-in-from-right duration-700 delay-500">
            <CardHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-transparent">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Activity className="w-5 h-5 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 animate-in fade-in slide-in-from-right"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'course' ? 'bg-purple-500' :
                      'bg-emerald-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}