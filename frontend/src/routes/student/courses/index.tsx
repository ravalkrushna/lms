/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { AppShell } from "@/components/AppShell"
import {
  getPublishedCourses,
  getMyCourses,
  enrollCourse,     // ✅ IMPORTANT
} from "@/lib/student"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/student/courses/")({
  component: CoursesPage,
})

function CoursesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  /* ✅ Published Courses */
  const { data: publishedCourses = [], isLoading } = useQuery({
    queryKey: ["published-courses"],
    queryFn: getPublishedCourses,
  })

  /* ✅ Enrolled Courses */
  const { data: myCourses = [] } = useQuery({
    queryKey: ["student-enrolled-courses"],
    queryFn: getMyCourses,
  })

  /* ✅ Enrollment Mutation (CRITICAL 🚀) */
  const enrollMutation = useMutation({
    mutationFn: enrollCourse,

    onSuccess: () => {
      /* ✅ Refresh enrollment cache */
      queryClient.invalidateQueries({
        queryKey: ["student-enrolled-courses"],
      })
    },
  })

  /* ✅ Fast Lookup Map */
  const enrolledCourseIds = new Set(
    myCourses.map((c: any) => c.courseId)
  )

  return (
    <AppShell title="Courses 📚">

      {isLoading && (
        <p className="text-muted-foreground text-sm">
          Loading courses...
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {publishedCourses.map((course: any) => {

          const isEnrolled = enrolledCourseIds.has(course.id)

          return (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {course.title}
                </CardTitle>
              </CardHeader>

              <CardContent>

                {/* ✅ NOT ENROLLED → ENROLL BUTTON */}

                {!isEnrolled && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      enrollMutation.mutate(course.id)
                    }
                    disabled={enrollMutation.isPending}
                  >
                    {enrollMutation.isPending
                      ? "Enrolling..."
                      : "Enroll Now"}
                  </Button>
                )}

                {/* ✅ ENROLLED → VIEW COURSE */}

                {isEnrolled && (
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() =>
                      navigate({
                        to: `/student/courses/${course.id}`,
                      })
                    }
                  >
                    Continue Learning ▶
                  </Button>
                )}

              </CardContent>
            </Card>
          )
        })}

      </div>
    </AppShell>
  )
}
