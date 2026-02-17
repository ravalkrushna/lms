/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { AppShell } from "@/components/AppShell"
import { getMyCourses } from "@/lib/student"

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
  BookOpen,
  TrendingUp,
} from "lucide-react"

export const Route = createFileRoute("/student/my-courses/")({
  component: MyCoursesPage,
})

function MyCoursesPage() {
  const navigate = useNavigate()

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["my-courses"],
    queryFn: getMyCourses,
  })

  return (
    <AppShell title="My Courses 🎓">

      {/* ✅ Loading */}
      {isLoading && (
        <p className="text-muted-foreground text-sm">
          Loading your courses...
        </p>
      )}

      {/* ✅ Empty State */}
      {!isLoading && courses.length === 0 && (
        <div className="text-center py-16">
          <GraduationCap
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h2 className="text-lg font-semibold mb-2">
            No Enrolled Courses
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Browse courses and start learning 🚀
          </p>

          <Button onClick={() => navigate({ to: "/student/courses" })}>
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Courses
          </Button>
        </div>
      )}

      {/* ✅ Courses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {courses.map((course: any) => (
          <Card
            key={course.courseId}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-base">
                {course.title}
              </CardTitle>

              <CardDescription>
                Progress: {course.progressPercent}%
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">

              {/* ✅ Progress Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>

              {/* ✅ Action */}
              <Button
                className="w-full"
                onClick={() =>
                  navigate({
                    to: `/student/courses/${course.courseId}`,
                  })
                }
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>

            </CardContent>
          </Card>
        ))}

      </div>

    </AppShell>
  )
}
