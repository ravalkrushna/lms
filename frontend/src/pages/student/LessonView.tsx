import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getStudentLesson, completeLesson } from "@/api/lesson"
import type { StudentLesson } from "@/types/StudentLesson"
import { Button } from "@/components/ui/button"

export default function LessonView() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const cId = Number(courseId)
  const lId = Number(lessonId)

  // 🔹 Fetch lesson (same pattern as CourseDetail)
  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery<StudentLesson>({
    queryKey: ["student-lesson", lId],
    queryFn: () => getStudentLesson(lId),
    enabled: Number.isFinite(lId),
  })

  // 🔹 Complete lesson mutation
  const completeMutation = useMutation({
    mutationFn: () => completeLesson(lId),
    onSuccess: () => {
      // refresh lesson
      qc.invalidateQueries({ queryKey: ["student-lesson", lId] })

      // refresh course progress
      qc.invalidateQueries({
        queryKey: ["student-course", cId],
      })
    },
  })

  if (isLoading) return <p>Loading lesson...</p>
  if (isError || !lesson) return <p>Failed to load lesson</p>

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <button
        className="text-sm text-blue-600"
        onClick={() => navigate(-1)}
      >
        ← Back to course
      </button>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">
          {lesson.title}
        </h1>

        {lesson.completed && (
          <span className="inline-block text-sm text-green-600">
            ✓ Completed
          </span>
        )}
      </header>

      {/* Video */}
      {lesson.videoUrl && (
        <div className="aspect-video">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full rounded"
            allowFullScreen
          />
        </div>
      )}

      {/* Content */}
      {lesson.content && (
        <div className="prose max-w-none">
          {lesson.content}
        </div>
      )}

      {/* Complete button */}
      {!lesson.completed && (
        <Button
          onClick={() => completeMutation.mutate()}
          disabled={completeMutation.isPending}
        >
          {completeMutation.isPending
            ? "Marking complete..."
            : "Mark as complete"}
        </Button>
      )}
    </div>
  )
}
