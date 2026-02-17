/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { AppShell } from "@/components/AppShell"
import { getPublishedCourses } from "@/lib/student"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/student/courses/")({
  component: CoursesPage,
})

function CoursesPage() {
  const navigate = useNavigate()

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["published-courses"],
    queryFn: getPublishedCourses,
  })

  return (
    <AppShell title="Courses 📚">

      {isLoading && <p>Loading courses...</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {courses.map((course: any) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle className="text-base">
                {course.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Button
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
    </AppShell>
  )
}
