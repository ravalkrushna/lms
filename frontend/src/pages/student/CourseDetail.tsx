import { useParams, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { getStudentCourseDetail } from "@/api/course"
import type { StudentCourse } from "@/types/StudentCourse"

export default function CourseDetail() {
  const navigate = useNavigate()

  const { courseId } = useParams({
    from: "/dashboard/student/courses/$courseId",
  })

  const id = Number(courseId)

  const { data, isLoading, isError } = useQuery<StudentCourse>({
    queryKey: ["student-course", id],
    queryFn: () => getStudentCourseDetail(id),
    enabled: Number.isFinite(id),
  })

  if (isLoading) {
    return (
      <p className="text-muted-foreground animate-pulse">
        Loading course...
      </p>
    )
  }

  if (isError || !data) {
    return (
      <p className="text-destructive">
        Failed to load course
      </p>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {data.title}
        </h1>

        <p className="text-sm text-muted-foreground">
          Continue your learning journey
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">

        {data.sections.map(section => (
          <div
            key={section.sectionId}
            className="bg-muted/40 border rounded-xl p-4 shadow-sm"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">

              <h2 className="text-xs font-semibold uppercase text-muted-foreground">
                {section.title}
              </h2>

              <span className="text-xs text-muted-foreground">
                {section.lessons.filter(l => l.completed).length}
                {" / "}
                {section.lessons.length} completed
              </span>
            </div>

            {/* Lessons */}
            <div className="space-y-2">

              {section.lessons.map(lesson => (
                <div
                  key={lesson.lessonId}
                  className="group flex items-center justify-between bg-background border rounded-lg px-4 py-3 hover:shadow-sm hover:scale-[1.01] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">

                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all
                        ${lesson.completed
                          ? "bg-green-500"
                          : "bg-muted-foreground/30"}
                      `}
                    />

                    <span className="text-sm font-medium">
                      {lesson.title}
                    </span>
                  </div>

                  <button
                    className="text-sm font-medium text-primary opacity-70 group-hover:opacity-100 transition"
                    onClick={() =>
                      navigate({
                        to: "/dashboard/student/courses/$courseId/lessons/$lessonId",
                        params: {
                          courseId: String(data.courseId),
                          lessonId: String(lesson.lessonId),
                        },
                      })
                    }
                  >
                    Open →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
