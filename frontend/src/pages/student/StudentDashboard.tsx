import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import CourseCard from "@/components/course/CourseCard"
import { getStudentCourses, type Course } from "@/api/course"

export default function StudentDashboard() {
  const navigate = useNavigate()

  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery<Course[]>({
    queryKey: ["student-courses"],
    queryFn: getStudentCourses,
  })

  if (isLoading) {
    return <p className="text-muted-foreground">Loading courses...</p>
  }

  if (isError || !courses) {
    return <p className="text-destructive">Failed to load courses</p>
  }

  if (courses.length === 0) {
    return (
      <p className="text-muted-foreground">
        You are not enrolled in any courses yet.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">
          Courses you are enrolled in
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <CourseCard
            key={course.courseId}
            title={course.title}
            description={`Progress: ${course.progressPercent}%`}
            onView={() =>
              navigate(`/student/courses/${course.courseId}`)
            }
          />
        ))}
      </div>
    </div>
  )
}
