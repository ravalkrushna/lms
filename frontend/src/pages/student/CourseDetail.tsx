import { useParams, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { getStudentCourse } from "@/api/student"
import type { StudentCourse } from "@/types/StudentCourse"

export default function CourseDetail() {
  const navigate = useNavigate()

  // ✅ FIXED PATH
  const { courseId } = useParams({
    from: "/dashboard/student/courses/$courseId",
  })

  const id = Number(courseId)

  const { data, isLoading, isError } = useQuery<StudentCourse>({
    queryKey: ["student-course", id],
    queryFn: () => getStudentCourse(id),
    enabled: Number.isFinite(id),
    staleTime: 1000 * 60 * 5,
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
                  navigate({
                    // ✅ FIXED PATH
                    to: "/dashboard/student/courses/$courseId/lessons/$lessonId",

                    params: {
                      courseId: String(data.courseId),
                      lessonId: String(lesson.lessonId),
                    },
                  })
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
