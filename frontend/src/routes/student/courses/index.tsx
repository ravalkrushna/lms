/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { AppShell } from "@/components/AppShell"
import {
  getPublishedCourses,
  getMyCourses,
  enrollCourse,
} from "@/lib/student"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/student/courses/")({
  component: CoursesPage,
})

function CourseCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

function CoursesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: publishedCourses = [], isLoading } = useQuery({
    queryKey: ["published-courses"],
    queryFn: getPublishedCourses,
  })

  const { data: myCourses = [] } = useQuery({
    queryKey: ["student-enrolled-courses"],
    queryFn: getMyCourses,
  })

  const enrollMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-enrolled-courses"],
      })
    },
  })

  const enrolledCourseIds = new Set(myCourses.map((c: any) => c.courseId))
  const enrolledCount = enrolledCourseIds.size

  return (
    <AppShell title="Courses 📚">

      {/* ── Header Summary Bar ── */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Browse Courses</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Explore all available courses and continue your learning journey.
          </p>
        </div>
        {enrolledCount > 0 && (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {enrolledCount} Enrolled
          </Badge>
        )}
      </div>

      <Separator className="mb-6" />

      {/* ── Course Grid ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}

        {/* Course Cards */}
        {!isLoading &&
          publishedCourses.map((course: any) => {
            const isEnrolled = enrolledCourseIds.has(course.id)
            const isThisEnrolling =
              enrollMutation.isPending &&
              enrollMutation.variables === course.id

            return (
              <Card
                key={course.id}
                className="flex flex-col justify-between transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">
                      {course.title}
                    </CardTitle>
                    {isEnrolled && (
                      <Badge className="shrink-0 text-xs">Enrolled</Badge>
                    )}
                  </div>
                  {course.description && (
                    <CardDescription className="text-sm line-clamp-2">
                      {course.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardFooter className="pt-0">
                  {!isEnrolled ? (
                    <Button
                      className="w-full"
                      onClick={() => enrollMutation.mutate(course.id)}
                      disabled={enrollMutation.isPending}
                    >
                      {isThisEnrolling ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() =>
                        navigate({ to: `/student/courses/${course.id}` })
                      }
                    >
                      Continue Learning ▶
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}

        {/* Empty state */}
        {!isLoading && publishedCourses.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No courses available yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}