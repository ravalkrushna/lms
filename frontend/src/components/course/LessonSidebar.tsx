import { useNavigate } from "@tanstack/react-router"
import type { StudentCourse } from "@/types/StudentCourse"

type Props = {
  course: StudentCourse
  activeLessonId: number
}

export function LessonSidebar({ course, activeLessonId }: Props) {
  const navigate = useNavigate()

  return (
    <div className="w-80 border-r bg-muted/30 backdrop-blur-sm p-5 overflow-y-auto">

      <h2 className="text-xl font-semibold mb-6 tracking-tight">
        {course.title}
      </h2>

      {course.sections.map(section => (
        <div key={section.sectionId} className="mb-6">

          <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            {section.title}
          </h3>

          <div className="space-y-1">
            {section.lessons.map(lesson => {
              const isActive = lesson.lessonId === activeLessonId

              return (
                <div
                  key={lesson.lessonId}
                  onClick={() =>
                    navigate({
                      to: "/dashboard/student/courses/$courseId/lessons/$lessonId",
                      params: {
                        courseId: String(course.courseId),
                        lessonId: String(lesson.lessonId),
                      },
                    })
                  }
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200

                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-background hover:shadow-sm"}
                  `}
                >
                  <span className="truncate">
                    {lesson.title}
                  </span>

                  {lesson.completed && (
                    <span className="text-green-500 text-xs">
                      ✓
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
