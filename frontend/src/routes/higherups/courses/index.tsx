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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Plus, BookOpen, ChevronDown, Eye } from "lucide-react"

export const Route = createFileRoute("/higherups/courses/")({
  component: HigherupsCoursesPage,
})

function HigherupsCoursesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { user, isLoading } = useAuth()

  const role = user?.role
  const isAdmin = permissions.isAdmin(user)
  const canCreate = permissions.canCreateCourse(user)

  const coursesQuery = useQuery({
    queryKey: ["higherups-courses", role],
    queryFn: getAdminCourses,
    enabled: !!user && !isLoading,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["higherups-courses"] })

  const publishMutation = useMutation({ mutationFn: publishCourse, onSuccess: invalidate })
  const unpublishMutation = useMutation({ mutationFn: unpublishCourse, onSuccess: invalidate })
  const archiveMutation = useMutation({ mutationFn: archiveCourse, onSuccess: invalidate })

  if (isLoading) return null
  if (!user) return null

  const courses = coursesQuery.data ?? []

  const isMutating =
    publishMutation.isPending ||
    unpublishMutation.isPending ||
    archiveMutation.isPending

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? "Manage platform courses" : "View platform courses"}
            </p>
          </div>

          {canCreate && (
            <Button onClick={() => navigate({ to: "/higherups/courses/create" })}>
              <Plus size={16} className="mr-2" />
              Create Course
            </Button>
          )}
        </div>

        {/* Table */}
        {coursesQuery.isLoading ? (
          <div>Loading courses...</div>
        ) : courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-lg border overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800 hover:bg-slate-800">
                  <TableHead className="text-slate-100 font-semibold">#</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Title</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Description</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-100 font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {courses.map((course: Course, index: number) => (
                  <TableRow
                    key={course.id}
                    className={ROW_STYLES[course.status]}
                  >

                    {/* Index */}
                    <TableCell className="text-xs text-muted-foreground w-8">
                      {index + 1}
                    </TableCell>

                    {/* Title */}
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className={ICON_STYLES[course.status]} />
                        {course.title}
                      </div>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {course.description || "No description"}
                    </TableCell>

                    {/* Status — clickable button that opens a dropdown to change it */}
                    <TableCell>
                      {isAdmin ? (
                        <StatusDropdown
                          course={course}
                          disabled={isMutating}
                          onPublish={() => publishMutation.mutate(course.id)}
                          onUnpublish={() => unpublishMutation.mutate(course.id)}
                          onArchive={() => archiveMutation.mutate(course.id)}
                        />
                      ) : (
                        <StatusButton status={course.status} />
                      )}
                    </TableCell>

                    {/* View */}
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/60 hover:bg-white"
                        onClick={() =>
                          navigate({
                            to: "/higherups/courses/$courseId",
                            params: { courseId: String(course.id) },
                          })
                        }
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

      </main>
    </div>
  )
}

// ─── Status button (display only) ────────────────────────────────────────────

const STATUS_STYLES: Record<CourseStatus, string> = {
  PUBLISHED: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
  DRAFT:     "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
  ARCHIVED:  "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
}

const ROW_STYLES: Record<CourseStatus, string> = {
  PUBLISHED: "bg-green-50 hover:bg-green-100 border-b border-green-100",
  DRAFT:     "bg-yellow-50 hover:bg-yellow-100 border-b border-yellow-100",
  ARCHIVED:  "bg-red-50 hover:bg-red-100 border-b border-red-100",
}

const ICON_STYLES: Record<CourseStatus, string> = {
  PUBLISHED: "text-green-500",
  DRAFT:     "text-yellow-500",
  ARCHIVED:  "text-red-400",
}

function StatusButton({ status }: { status: CourseStatus }) {
  return (
    <Button
      size="sm"
      variant="outline"
      className={`capitalize text-xs font-semibold cursor-default ${STATUS_STYLES[status]}`}
    >
      {status}
    </Button>
  )
}

// ─── Status dropdown (admin — click to change) ────────────────────────────────

interface StatusDropdownProps {
  course: Course
  disabled: boolean
  onPublish: () => void
  onUnpublish: () => void
  onArchive: () => void
}

function StatusDropdown({
  course,
  disabled,
  onPublish,
  onUnpublish,
  onArchive,
}: StatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled}
          className={`capitalize text-xs font-semibold gap-1 ${STATUS_STYLES[course.status]}`}
        >
          {course.status}
          <ChevronDown size={12} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {course.status !== "PUBLISHED" && course.status !== "ARCHIVED" && (
          <DropdownMenuItem onClick={onPublish}>
            ✅ Publish
          </DropdownMenuItem>
        )}

        {course.status === "PUBLISHED" && (
          <DropdownMenuItem onClick={onUnpublish}>
            ⏸ Unpublish
          </DropdownMenuItem>
        )}

        {course.status !== "ARCHIVED" && (
          <DropdownMenuItem
            onClick={onArchive}
            className="text-destructive focus:text-destructive"
          >
            🗄 Archive
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
      <p>No courses found</p>
    </div>
  )
}