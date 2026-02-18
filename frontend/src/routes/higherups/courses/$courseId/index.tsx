/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  getCourseById,
  getCourseSections,
  type Course,
  type Section,
  type CourseStatus,
} from "@/lib/higherups"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { BookOpen, LayoutList, Plus } from "lucide-react"

/* ── Route ── */
export const Route = createFileRoute(
  "/higherups/courses/$courseId/"
)({
  component: HigherupsCourseDetailPage,
})

function HigherupsCourseDetailPage() {
  const navigate = useNavigate()
  const { courseId } = Route.useParams()

  const numericCourseId = Number(courseId)

  if (!numericCourseId) {
    console.error("Invalid courseId:", courseId)
    return null
  }

  /* ── Queries ── */

  const courseQuery = useQuery<Course>({
    queryKey: ["course-detail", numericCourseId],
    queryFn: () => getCourseById(numericCourseId),
  })

  const sectionsQuery = useQuery<Section[]>({
    queryKey: ["course-sections-preview", numericCourseId],
    queryFn: () => getCourseSections(numericCourseId),
  })

  if (courseQuery.isLoading) {
    return <PageSkeleton />
  }

  const course = courseQuery.data
  const sections = sectionsQuery.data ?? []

  if (!course) return null

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen size={20} />
              {course.title}
            </h1>

            <div className="mt-2">
              <StatusBadge status={course.status} />
            </div>
          </div>

          <Button
            onClick={() =>
              navigate({
                to: "/higherups/courses/$courseId/sections",
                params: { courseId },
              })
            }
          >
            <LayoutList size={16} className="mr-2" />
            Manage Sections
          </Button>
        </div>

        {/* ── Course Info ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Course Information
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              {course.description || "No description provided"}
            </p>
          </CardContent>
        </Card>

        {/* ── Sections Preview ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Sections</CardTitle>
              <CardDescription>
                {sections.length} section{sections.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                navigate({
                  to: "/higherups/courses/$courseId/sections",
                  params: { courseId },
                })
              }
            >
              <Plus size={14} className="mr-1" />
              Add Section
            </Button>
          </CardHeader>

          <Separator />

          <CardContent className="pt-4 space-y-2">

            {sectionsQuery.isLoading ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : sections.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sections yet
              </p>
            ) : (
              sections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between p-3 rounded-md border bg-background"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-primary/10 text-primary text-xs flex items-center justify-center">
                      {index + 1}
                    </div>

                    <p className="text-sm font-medium">
                      {section.title}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      navigate({
                        to: "/higherups/courses/$courseId/$sectionId/lessons",
                        params: {
                          courseId,
                          sectionId: String(section.id),
                        },
                      })
                    }
                  >
                    Lessons
                  </Button>
                </div>
              ))
            )}

          </CardContent>
        </Card>
      </main>
    </div>
  )
}

/* ── Status Badge ── */

function StatusBadge({ status }: { status: CourseStatus }) {
  const variant =
    status === "PUBLISHED"
      ? "default"
      : status === "DRAFT"
      ? "secondary"
      : "destructive"

  return <Badge variant={variant}>{status}</Badge>
}

/* ── Skeleton ── */

function PageSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
