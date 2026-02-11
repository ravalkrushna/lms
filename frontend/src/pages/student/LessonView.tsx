import { useParams, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getStudentLesson, completeLesson } from "@/api/lesson"
import { getStudentCourseDetail } from "@/api/course"

import type { StudentLesson } from "@/types/StudentLesson"
import type { StudentCourse } from "@/types/StudentCourse"

import { LessonSidebar } from "@/components/course/LessonSidebar"
import { Button } from "@/components/ui/button"

function getEmbedUrl(url: string) {
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v")
    return `https://www.youtube.com/embed/${videoId}`
  }

  if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop()
    return `https://www.youtube.com/embed/${videoId}`
  }

  return url
}

export default function LessonView() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { courseId, lessonId } = useParams({
    from: "/dashboard/student/courses/$courseId/lessons/$lessonId",
  })

  const cId = Number(courseId)
  const lId = Number(lessonId)

  const { data: course } = useQuery<StudentCourse>({
    queryKey: ["student-course", cId],
    queryFn: () => getStudentCourseDetail(cId),
  })

  const { data: lesson, isLoading, isError } =
    useQuery<StudentLesson>({
      queryKey: ["student-lesson", lId],
      queryFn: () => getStudentLesson(lId),
      enabled: Number.isFinite(lId),
    })

  const completeMutation = useMutation({
    mutationFn: () => completeLesson(lId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-lesson", lId] })
      queryClient.invalidateQueries({ queryKey: ["student-course", cId] })
    },

    onError: (err) => {
      console.log("Completion failed", err)
    }
  })

  if (isLoading || !course) return <p>Loading lesson...</p>
  if (isError || !lesson) return <p>Failed to load lesson</p>

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">

      <LessonSidebar
        course={course}
        activeLessonId={lId}
      />

      <div className="flex-1 p-10 overflow-y-auto">

        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">

          <button
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() =>
              navigate({
                to: "/dashboard/student/courses/$courseId",
                params: { courseId },
              })
            }
          >
            ← Back to course
          </button>

          <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-6">

            <header className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {lesson.title}
              </h1>

              {lesson.completed && (
                <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                  ✓ Completed
                </span>
              )}
            </header>

            {lesson.videoUrl && (
              <div className="aspect-video rounded-xl overflow-hidden border bg-muted">
                <iframe
                  src={getEmbedUrl(lesson.videoUrl)}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}

            {lesson.content && (
              <div className="prose max-w-none">
                {lesson.content}
              </div>
            )}

            {!lesson.completed && (
              <Button
                size="lg"
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending
                  ? "Marking complete..."
                  : "Mark as complete"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
