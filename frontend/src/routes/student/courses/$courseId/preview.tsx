import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { AppShell } from "@/components/AppShell"
import {
  getPublicCourseDetail,
  enrollCourse,
} from "@/lib/student"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  Layers,
  PlayCircle,
  GraduationCap,
} from "lucide-react"

export const Route = createFileRoute(
  "/student/courses/$courseId/preview"
)({
  component: CoursePreviewPage,
})

type PublicCourseDetail = {
  id: number
  title: string
  description?: string
  instructorName: string
  totalSections: number
  totalLessons: number
}

function CoursePreviewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const params = Route.useParams()
  const courseId = Number(params.courseId)

  const { data, isLoading } = useQuery<PublicCourseDetail>({
    queryKey: ["public-course-detail", courseId],
    queryFn: () => getPublicCourseDetail(courseId),
  })

  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-enrolled-courses"] })

      navigate({
        to: `/student/courses/${courseId}`,
      })
    },
  })

  return (
    <AppShell title="Course Preview 🚀">

      {isLoading && (
        <p className="text-muted-foreground text-sm">
          Loading course details...
        </p>
      )}

      {data && (
        <div className="space-y-6 max-w-3xl mx-auto">

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {data.title}
              </CardTitle>

              <CardDescription>
                Instructor: {data.instructorName}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {data.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Layers size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Sections</p>
                  <p className="text-xl font-bold">
                    {data.totalSections}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <PlayCircle size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Lessons</p>
                  <p className="text-xl font-bold">
                    {data.totalLessons}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap size={20} />
                Start Learning Today
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

        </div>
      )}

    </AppShell>
  )
}
