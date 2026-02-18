import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  getAdminCourses,
  publishCourse,
  unpublishCourse,
  archiveCourse,
  type Course,
  type CourseStatus,
} from "@/lib/higherups"

import { permissions } from "@/lib/permissions"
import { useAuth } from "@/lib/auth-context"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Plus, BookOpen } from "lucide-react"

export const Route = createFileRoute("/higherups/courses/")({
  component: HigherupsCoursesPage,
})

function HigherupsCoursesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  /* ✅ Hooks ALWAYS run */
  const { user, isLoading } = useAuth()

  const role = user?.role
  const isAdmin = permissions.isAdmin(user)
  const canCreate = permissions.canCreateCourse(user)

  const coursesQuery = useQuery({
    queryKey: ["higherups-courses", role],
    queryFn: getAdminCourses,

    /* ⭐ CRITICAL FIX */
    enabled: !!user && !isLoading,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["higherups-courses"] })

  const publishMutation = useMutation({ mutationFn: publishCourse, onSuccess: invalidate })
  const unpublishMutation = useMutation({ mutationFn: unpublishCourse, onSuccess: invalidate })
  const archiveMutation = useMutation({ mutationFn: archiveCourse, onSuccess: invalidate })

  /* ✅ Guards AFTER hooks */
  if (isLoading) return null
  if (!user) return null

  const courses = coursesQuery.data ?? []

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? "Manage platform courses" : "View platform courses"}
            </p>
          </div>

          {canCreate && (
            <Button
              onClick={() => navigate({ to: "/higherups/courses/create" })}
            >
              <Plus size={16} className="mr-2" />
              Create Course
            </Button>
          )}
        </div>

        {coursesQuery.isLoading ? (
          <div>Loading courses...</div>
        ) : courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: Course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen size={16} />
                      {course.title}
                    </CardTitle>

                    <StatusBadge status={course.status} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {course.description || "No description"}
                  </p>
                  
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate({
                          to: "/higherups/courses/$courseId",
                          params: { courseId: String(course.id) },
                        })
                      }
                    >
                      View
                    </Button>

                    {isAdmin && (
                      <div className="flex gap-2 flex-wrap">

                        {course.status === "DRAFT" && (
                          <Button size="sm" onClick={() => publishMutation.mutate(course.id)}>
                            Publish
                          </Button>
                        )}

                        {course.status === "PUBLISHED" && (
                          <Button size="sm" variant="secondary" onClick={() => unpublishMutation.mutate(course.id)}>
                            Unpublish
                          </Button>
                        )}

                        {course.status !== "ARCHIVED" && (
                          <Button size="sm" variant="destructive" onClick={() => archiveMutation.mutate(course.id)}>
                            Archive
                          </Button>
                        )}
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: CourseStatus }) {
  const variant =
    status === "PUBLISHED"
      ? "default"
      : status === "DRAFT"
        ? "secondary"
        : "destructive"

  return <Badge variant={variant}>{status}</Badge>
}

function EmptyState() {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
      <p>No courses found</p>
    </div>
  )
}
