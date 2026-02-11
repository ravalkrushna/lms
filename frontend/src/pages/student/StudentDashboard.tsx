import { useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import CourseCard from "@/components/course/CourseCard"
import ProfileCard from "@/components/profile/ProfileCard"

import { getStudentCourses, type Course } from "@/api/course"
import { useUserProfile } from "@/hooks/useProfile"

export default function StudentDashboard() {
  const navigate = useNavigate()

  const profileQuery = useUserProfile()

  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery<Course[]>({
    queryKey: ["student-courses"],
    queryFn: getStudentCourses,
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return <p className="text-muted-foreground">Loading courses...</p>
  }

  if (isError || !courses) {
    return <p className="text-destructive">Failed to load courses</p>
  }

  return (
    <div className="space-y-6">

      {/* ✅ PROFILE SECTION */}
      {profileQuery.isLoading && (
        <p className="text-muted-foreground">Loading profile...</p>
      )}

      {profileQuery.isError && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded">
          Please complete your profile
        </div>
      )}

      {profileQuery.data && (
        <ProfileCard
          title={profileQuery.data.name}
          subtitle={profileQuery.data.collegeName}
          extra={profileQuery.data.email}
        />
      )}

      {/* ✅ COURSES SECTION */}
      <header>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">
          Courses you are enrolled in
        </p>
      </header>

      {courses.length === 0 ? (
        <p className="text-muted-foreground">
          You are not enrolled in any courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <CourseCard
              key={course.courseId}
              title={course.title}
              description={`Progress: ${course.progressPercent}%`}
              onView={() =>
                navigate({
                  to: "/dashboard/student/courses/$courseId",
                  params: {
                    courseId: String(course.courseId),
                  },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
