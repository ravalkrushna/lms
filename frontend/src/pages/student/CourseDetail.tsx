import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { getStudentCourse } from "@/api/student"
import type { StudentCourse } from "@/types/StudentCourse"

export default function CourseDetail() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const id = Number(courseId)

  const {
    data,
    isLoading,
    isError,
  } = useQuery<StudentCourse>({
    queryKey: ["student-course", id],
    queryFn: () => getStudentCourse(id),
    enabled: Number.isFinite(id),
  })

  if (isLoading) {
    return <p className="text-muted-foreground">Loading course...</p>
  }

  if (isError || !data) {
    return <p className="text-destructive">Failed to load course</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{data.title}</h1>

      {data.sections.length === 0 && (
        <p className="text-muted-foreground">
          No sections available yet.
        </p>
      )}

      {data.sections.map(section => (
        <div key={section.sectionId} className="space-y-2">
          <h2 className="font-medium">{section.title}</h2>

          {section.lessons.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No lessons in this section.
            </p>
          )}

          {section.lessons.map(lesson => (
            <div
              key={lesson.lessonId}
              className="flex items-center justify-between border rounded p-2 hover:bg-muted"
            >
              <span>
                {lesson.completed && "✅ "}
                {lesson.title}
              </span>

              <button
                className="text-sm text-blue-600"
                onClick={() =>
                  navigate(
                    `/student/courses/${data.courseId}/lessons/${lesson.lessonId}`
                  )
                }
              >
                Open
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
