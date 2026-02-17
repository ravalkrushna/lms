import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { AppShell } from "@/components/AppShell"
import { getMyCourses, getPublishedCourses } from "@/lib/student"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  GraduationCap,
  BarChart3,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react"

export const Route = createFileRoute("/student/dashboard")({
  component: StudentDashboard,
})

/* ✅ Types (Move to types.ts later if you want) */
type StudentCourse = {
  courseId: number
  title: string
  progressPercent: number
  completed: boolean
}

type PublishedCourse = {
  id: number
  title: string
  description?: string
}

function StudentDashboard() {
  const navigate = useNavigate()

  /* ✅ Queries */
  const { data: enrolledCourses = [], isLoading } = useQuery<StudentCourse[]>({
    queryKey: ["student-enrolled-courses"],
    queryFn: getMyCourses,
  })

  const { data: publishedCourses = [] } = useQuery<PublishedCourse[]>({
    queryKey: ["student-published-courses"],
    queryFn: getPublishedCourses,
  })

  /* ✅ Derived Stats */
  const overallProgress = calculateOverallProgress(enrolledCourses)

  const inProgressCourses = enrolledCourses.filter(
    (c) => c.progressPercent > 0 && c.progressPercent < 100
  ).length

  const completedCourses = enrolledCourses.filter(
    (c) => c.progressPercent === 100
  ).length

  return (
    <AppShell title="Student Dashboard 🎓">

      {/* ✅ Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <StatsCard
          icon={<GraduationCap size={18} />}
          label="Enrolled Courses"
          value={enrolledCourses.length}
        />

        <StatsCard
          icon={<BarChart3 size={18} />}
          label="Overall Progress"
          value={`${overallProgress}%`}
        />

        <StatsCard
          icon={<TrendingUp size={18} />}
          label="In Progress"
          value={inProgressCourses}
        />

        <StatsCard
          icon={<Award size={18} />}
          label="Completed"
          value={completedCourses}
        />

      </div>

      {/* ✅ Continue Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
          <CardDescription>
            Pick up where you left off
          </CardDescription>
        </CardHeader>

        <CardContent>

          {isLoading && (
            <p className="text-muted-foreground text-sm">
              Loading courses...
            </p>
          )}

          {!isLoading && enrolledCourses.length === 0 && (
            <p className="text-muted-foreground text-sm">
              You haven't enrolled in any courses yet.
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {enrolledCourses.map((course) => (
              <Card key={course.courseId}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {course.title}
                  </CardTitle>
                  <CardDescription>
                    Progress: {course.progressPercent}%
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate({
                        to: `/student/courses/${course.courseId}`,
                      })
                    }
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            ))}

          </div>
        </CardContent>
      </Card>

      {/* ✅ Discover Courses */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Discover Courses</CardTitle>
              <CardDescription>
                Explore available learning paths
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/student/courses" })}
            >
              View All
              <ChevronRight size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {publishedCourses.slice(0, 3).map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      navigate({
                        to: `/student/courses/${course.id}`,
                      })
                    }
                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            ))}

          </div>
        </CardContent>
      </Card>

    </AppShell>
  )
}

/* ✅ Stats Card */
function StatsCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <Card>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </CardContent>
    </Card>
  )
}

/* ✅ Progress Calculation */
function calculateOverallProgress(courses: StudentCourse[]) {
  if (!courses.length) return 0

  const total = courses.reduce(
    (sum, c) => sum + (c.progressPercent ?? 0),
    0
  )

  return Math.round(total / courses.length)
}
