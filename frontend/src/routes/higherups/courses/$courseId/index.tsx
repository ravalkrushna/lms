/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  getCourseById,
  getCourseSections,
  type Course,
  type Section,
  type CourseStatus,
} from "@/lib/higherups"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import {
  BookOpen,
  LayoutList,
  Plus,
  Layers,
} from "lucide-react"

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
  if (!numericCourseId) return null

  const courseQuery = useQuery<Course>({
    queryKey: ["course-detail", numericCourseId],
    queryFn: () => getCourseById(numericCourseId),
  })

  const sectionsQuery = useQuery<Section[]>({
    queryKey: ["course-sections-preview", numericCourseId],
    queryFn: () => getCourseSections(numericCourseId),
  })

  if (courseQuery.isLoading) return <PageSkeleton />

  const course = courseQuery.data
  const sections = sectionsQuery.data ?? []

  if (!course) return null

  return (
    <div className="flex min-h-screen bg-muted/50">
      <HigherupsSidebar />

      <main className="flex-1">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto p-8 space-y-8"
        >

          {/* ── HERO HEADER */}
          <div className="relative rounded-3xl border bg-background p-8 shadow-sm overflow-hidden">

            {/* Background Accent */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />

            <div className="relative flex items-start justify-between">

              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <BookOpen size={18} />
                  </div>

                  {course.title}
                </h1>

                <div className="mt-4 flex items-center gap-3">
                  <StatusBadge status={course.status} />

                  <span className="text-sm text-muted-foreground">
                    Course Workspace
                  </span>
                </div>

                {/* Inline Stats (Integrated = Key Upgrade) */}
                <div className="mt-6 flex gap-10">

                  <Stat label="Sections" value={sections.length} />
                  <Stat label="Visibility" value="Controlled" />
                  <Stat label="Progress" value="—" />

                </div>
              </div>

              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() =>
                    navigate({
                      to: "/higherups/courses/$courseId/sections",
                      params: { courseId },
                    })
                  }
                  className="shadow-sm"
                >
                  <LayoutList size={16} className="mr-2" />
                  Manage Sections
                </Button>
              </motion.div>
            </div>
          </div>

          {/* ── DESCRIPTION BLOCK */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.description || "No description provided"}
            </p>
          </div>

          {/* ── SECTIONS AREA */}
          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Layers size={16} />
                  Sections
                </h2>

                <p className="text-sm text-muted-foreground">
                  Organise course structure
                </p>
              </div>

              <motion.div whileTap={{ scale: 0.95 }}>
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
              </motion.div>
            </div>

            {/* Sections List */}
            <div className="space-y-3">

              {sectionsQuery.isLoading ? (
                <>
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                </>
              ) : sections.length === 0 ? (
                <div className="rounded-2xl border bg-background p-10 text-center text-muted-foreground">
                  No sections yet
                </div>
              ) : (
                sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    whileHover={{ scale: 1.01 }}
                    className="group rounded-2xl border bg-background p-5 flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-4">

                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {section.title}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Section workspace
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="opacity-70 group-hover:opacity-100 transition"
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
                      Open →
                    </Button>
                  </motion.div>
                ))
              )}

            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

/* ── Small Components */

function StatusBadge({ status }: { status: CourseStatus }) {
  const variant =
    status === "PUBLISHED"
      ? "default"
      : status === "DRAFT"
      ? "secondary"
      : "destructive"

  return <Badge variant={variant}>{status}</Badge>
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

/* ── Skeleton */

function PageSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-24 w-full rounded-3xl" />
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  )
}