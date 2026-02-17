/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { AppShell } from "@/components/AppShell"
import { getCourseDetail, enrollCourse } from "@/lib/student"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  BookOpen,
  PlayCircle,
  CheckCircle,
  GraduationCap,
} from "lucide-react"

export const Route = createFileRoute("/student/courses/$courseId")({  
  component: CourseDetailPage,
})

/* ✅ Types */
type Lesson = {
  lessonId: number
  title: string
  completed: boolean
}

type Section = {
  sectionId: number
  title: string
  lessons: Lesson[]
}

type CourseDetail = {
  courseId: number
  title: string
  sections: Section[]
}

function CourseDetailPage() {
  const { courseId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  /* ✅ Query */
  const { data, isLoading, error } = useQuery<CourseDetail>({
    queryKey: ["course-detail", courseId],
    queryFn: () => getCourseDetail(Number(courseId)),
    retry: false, // VERY IMPORTANT (avoid retry loop on 403)
  })

  /* ✅ Detect Enrollment Block */
  const isForbidden =
    (error as any)?.response?.status === 403

  /* ✅ Enrollment Mutation */
  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(Number(courseId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-detail", courseId] })
      queryClient.invalidateQueries({ queryKey: ["student-enrolled-courses"] })
      queryClient.invalidateQueries({ queryKey: ["my-courses"] })
    },
  })

  return (
    <AppShell title="Course Detail 📚">

      {/* ✅ Loading */}
      {isLoading && (
        <p className="text-muted-foreground text-sm">
          Loading course...
        </p>
      )}

      {/* ✅ Not Enrolled UI 🚀 */}
      {isForbidden && (
        <Card className="max-w-md mx-auto mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap size={20} />
              Enroll to Access Course
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full"
              onClick={() => enrollMutation.mutate()}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending
                ? "Enrolling..."
                : "Enroll Now 🚀"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ✅ Course Content */}
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

          {/* ✅ Empty Curriculum Guard */}
          {data.sections.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No sections available in this course.
            </p>
          )}

          {/* ✅ Sections */}
          <div className="grid gap-4">

            {data.sections.map((section) => (
              <Card key={section.sectionId}>

                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen size={18} />
                    {section.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">

                    {/* ✅ Lessons */}
                    {section.lessons.map((lesson) => (
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

                          <PlayCircle
                            size={18}
                            className="text-primary"
                          />

                          <span className="text-sm font-medium">
                            {lesson.title}
                          </span>
                        </div>

                        {/* ✅ Completion Indicator */}
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
