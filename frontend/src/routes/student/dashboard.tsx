import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AppShell } from "@/components/AppShell"
import { getEnrolledCourses } from "@/lib/student"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  BookOpen,
  GraduationCap,
  BarChart3,
} from "lucide-react"

export const Route = createFileRoute("/student/dashboard")({
  component: StudentDashboard,
})

function StudentDashboard() {
  const navigate = useNavigate()

  const { data: courses, isLoading } = useQuery({
    queryKey: ["student-courses"],
    queryFn: getEnrolledCourses,
  })

  const overallProgress = calculateOverallProgress(courses)

  return (
    <AppShell title="Student Dashboard 🎓">

      {/* ✅ Welcome Section */}
      <Card className="bg-linear-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">
            Welcome back 👋
          </h2>
          <p className="text-muted-foreground text-sm">
            Continue your learning journey 🚀
          </p>
        </CardContent>
      </Card>

      {/* ✅ Stats */}
      <div className="grid gap-4 md:grid-cols-3">

        <StatsCard
          icon={<GraduationCap size={18} />}
          label="Enrolled Courses"
          value={courses?.length ?? 0}
        />

        <StatsCard
          icon={<BarChart3 size={18} />}
          label="Overall Progress"
          value={`${overallProgress}%`}
        />

        <StatsCard
          icon={<BookOpen size={18} />}
          label="Active Learning"
          value={courses?.length ? "Yes 🚀" : "No"}
        />

      </div>

      {/* ✅ Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={18} />
            My Courses 📚
          </CardTitle>
        </CardHeader>

        <CardContent>

          {isLoading && (
            <p className="text-muted-foreground text-sm">
              Loading courses...
            </p>
          )}

          {!isLoading && (!courses || courses.length === 0) && (
            <EmptyState />
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {courses?.map((course: any) => (
              <Card
                key={course.courseId}
                className="hover:shadow-md transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="text-base">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* ✅ Progress Bar */}
                  <div className="space-y-2">

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{course.progressPercent}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>

                  </div>

                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate({
                        to: `/student/courses/${course.courseId}`,
                      })
                    }
                  >
                    Continue Learning 🚀
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
      <CardContent className="p-4 flex items-center gap-3">

        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <div className="text-xs text-muted-foreground">
            {label}
          </div>
          <div className="text-xl font-semibold">
            {value}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

/* ✅ Empty State */
function EmptyState() {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <div className="text-lg">📚</div>
      <div>No enrolled courses yet</div>
      <div className="text-sm">
        Start learning today 🚀
      </div>
    </div>
  )
}

/* ✅ Overall Progress */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateOverallProgress(courses: any[] | undefined) {
  if (!courses?.length) return 0

  const total = courses.reduce(
    (sum, c) => sum + (c.progressPercent ?? 0),
    0
  )

  return Math.round(total / courses.length)
}
