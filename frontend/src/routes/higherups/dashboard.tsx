/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react"

import {
  getAdminCourses,
  getAdminUsers,
  getInstructorStats,
  type Course,
} from "@/lib/higherups"

import { useAuth } from "@/lib/auth-context"
import { permissions } from "@/lib/permissions"
import { HigherupsSidebar } from "@/components/HigherupsSidebar"

export const Route = createFileRoute("/higherups/dashboard")({
  component: HigherupsDashboard,
})

function HigherupsDashboard() {
  const auth = useAuth()
  const user = auth?.user
  const userLoading = auth?.isLoading

  if (userLoading) return null
  if (!user) return null

  const isAdmin = permissions.isAdmin(user)

  /* ✅ Queries */

  const coursesQuery = useQuery({
    queryKey: ["higherups-courses"],
    queryFn: getAdminCourses,
  })

  const usersQuery = useQuery({
    queryKey: ["higherups-users"],
    queryFn: getAdminUsers,
    enabled: isAdmin,
  })

  const instructorStatsQuery = useQuery({
    queryKey: ["higherups-instructor-stats"],
    queryFn: getInstructorStats,
    enabled: !isAdmin,
  })

  /* ✅ Derived Values */

  const totalCourses =
    coursesQuery.data?.length ??
    instructorStatsQuery.data?.totalCourses ??
    0

  const totalStudents =
    usersQuery.data?.filter(u => u.role === "STUDENT").length ??
    instructorStatsQuery.data?.totalStudents ??
    0

  const totalInstructors =
    usersQuery.data?.filter(u => u.role === "INSTRUCTOR").length ?? 0

  const isLoading =
    coursesQuery.isLoading ||
    usersQuery.isLoading ||
    instructorStatsQuery.isLoading

  const recentCourses = coursesQuery.data?.slice(0, 5) ?? []

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ✅ Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Platform overview & insights"
                : "Your teaching overview"}
            </p>
          </div>

          <Badge variant="outline" className="gap-1.5 text-xs">
            <Clock size={12} />
            {new Date().toLocaleDateString()}
          </Badge>
        </div>

        {/* ✅ Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Courses"
            value={totalCourses}
            icon={BookOpen}
            loading={isLoading}
          />

          <StatCard
            label="Students"
            value={totalStudents}
            icon={Users}
            loading={isLoading}
          />

          {isAdmin && (
            <StatCard
              label="Instructors"
              value={totalInstructors}
              icon={GraduationCap}
              loading={isLoading}
            />
          )}

          <StatCard
            label="Growth"
            value="+18%"
            icon={TrendingUp}
            loading={false}
          />
        </div>

        {/* ✅ Lower Section */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* ✅ Recent Courses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>
                Latest courses on the platform
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : recentCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No courses yet
                </p>
              ) : (
                recentCourses.map((course: Course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.description || "No description"}
                      </p>
                    </div>

                    <Badge variant="secondary">
                      {course.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* ✅ Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common management tasks
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {isAdmin ? (
                <>
                  <Button className="w-full justify-start">
                    <Plus size={16} className="mr-2" />
                    Create Course
                  </Button>

                  <Button variant="secondary" className="w-full justify-start">
                    <Users size={16} className="mr-2" />
                    Manage Users
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap size={16} className="mr-2" />
                    Promote Instructor
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full justify-start">
                    <BookOpen size={16} className="mr-2" />
                    My Courses
                  </Button>

                  <Button variant="secondary" className="w-full justify-start">
                    <Users size={16} className="mr-2" />
                    Students
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string
  value: number | string
  icon: any
  loading: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Icon size={16} />
        </div>

        {loading ? (
          <Skeleton className="h-9 w-20 mt-2" />
        ) : (
          <p className="text-3xl font-bold mt-2">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}
