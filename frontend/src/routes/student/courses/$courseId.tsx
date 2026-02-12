/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AppShell } from "@/components/AppShell"
import { getCourseDetail } from "@/lib/student"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { BookOpen, PlayCircle, CheckCircle } from "lucide-react"

export const Route = createFileRoute("/student/courses/$courseId")({
  component: CourseDetailPage,
})

function CourseDetailPage() {
  const { courseId } = Route.useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ["course-detail", courseId],
    queryFn: () => getCourseDetail(Number(courseId)),
  })

  return (
    <AppShell title="Course Detail 📚">

      {isLoading && (
        <p className="text-muted-foreground">
          Loading course...
        </p>
      )}

      {data && (
        <div className="space-y-6">

          {/* ✅ Course Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {data.title}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* ✅ Sections */}
          <div className="grid gap-4">

            {data.sections.map((section: any) => (
              <Card key={section.sectionId}>

                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen size={18} />
                    {section.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">

                    {/* Lessons */}
                    {section.lessons.map((lesson: any) => (
                      <div
                        key={lesson.lessonId}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                        onClick={() =>
                          navigate({
                            to: `/student/lessons/${lesson.lessonId}`,
                          })
                        }
                      >
                        <div className="flex items-center gap-3">

                          <PlayCircle size={18} className="text-primary" />

                          <span className="text-sm font-medium">
                            {lesson.title}
                          </span>
                        </div>

                        {/* Completion Indicator */}
                        {lesson.completed ? (
                          <CheckCircle
                            size={18}
                            className="text-green-500"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Not Completed
                          </span>
                        )}
                      </div>
                    ))}

                  </div>
                </CardContent>

              </Card>
            ))}

          </div>
        </div>
      )}

    </AppShell>
  )
}
