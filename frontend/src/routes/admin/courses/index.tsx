import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { AdminSidebar } from "@/components/AdminSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  getAllCourses,
  publishCourse,
  unpublishCourse,
  archiveCourse,
  type AdminCourse,
} from "@/lib/admin"

export const Route = createFileRoute("/admin/courses/")({
  component: AdminCourses,
})

function AdminCourses() {
  const navigate = useNavigate()
  // const queryClient = useQueryClient()

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: getAllCourses,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Course Management 📚</CardTitle>

            <Button onClick={() => navigate({ to: "/admin/courses/create" })}>
              Create Course +
            </Button>
          </CardHeader>

          <CardContent>

            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading courses...
              </p>
            )}

            {!isLoading && (!courses || courses.length === 0) && (
              <EmptyState />
            )}

            {!isLoading && courses && courses.length > 0 && (
              <div className="rounded-md border bg-background">

                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-3">Title</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Sections</th>
                    </tr>
                  </thead>

                  <tbody>
                    {courses.map(course => (
                      <tr
                        key={course.id}
                        className="border-b last:border-none hover:bg-muted/40"
                      >
                        <td className="p-3 font-medium">
                          {course.title}
                        </td>

                        <td className="p-3">
                          <StatusControl course={course} />
                        </td>

                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate({
                                to: "/admin/courses/$courseId/sections",
                                params: { courseId: String(course.id) },
                              })
                            }
                          >
                            Sections 📚
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </CardContent>
        </Card>

      </main>
    </div>
  )
}

function StatusControl({ course }: { course: AdminCourse }) {
  const queryClient = useQueryClient()

  const publish = useMutation({
    mutationFn: () => publishCourse(course.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  })

  const unpublish = useMutation({
    mutationFn: () => unpublishCourse(course.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  })

  const archive = useMutation({
    mutationFn: () => archiveCourse(course.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  })

  return (
    <select
      value={course.status}
      onChange={(e) => {
        const value = e.target.value

        if (value === "PUBLISHED") publish.mutate()
        if (value === "DRAFT") unpublish.mutate()
        if (value === "ARCHIVED") archive.mutate()
      }}
      className="border rounded-md px-2 py-1 text-sm bg-background"
    >
      <option value="DRAFT">Draft</option>
      <option value="PUBLISHED">Published</option>
      <option value="ARCHIVED">Archived</option>
    </select>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <div className="text-lg">📦</div>
      <div>No courses found</div>
      <div className="text-sm">
        Create your first course 🚀
      </div>
    </div>
  )
}
