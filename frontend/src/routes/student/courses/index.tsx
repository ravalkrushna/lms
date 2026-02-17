/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AppShell } from "@/components/AppShell"
import {
  getPublishedCourses,
  getMyCourses,
  enrollCourse,
} from "@/lib/student"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

import {
  BookOpen,
  CheckCircle2,
  Search,
  GraduationCap,
  Lightbulb,
  Star,
  TrendingUp,
} from "lucide-react"

import { useMemo } from "react"
import { z } from "zod"

/* ── Search schema — URL driven, no useState ── */
const searchSchema = z.object({
  q: z.string().optional().catch(""),
})

export const Route = createFileRoute("/student/courses/")({
  component: CoursesPage,
  validateSearch: searchSchema,
})

const TIPS = [
  { icon: BookOpen,   text: "Enroll in a course to start tracking your progress automatically." },
  { icon: Star,       text: "Courses with descriptions give you a clear idea of what you'll learn." },
  { icon: TrendingUp, text: "Use Continue Learning to pick up exactly where you left off."        },
]

function CourseCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

function CoursesPage() {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()

  /* ── URL-driven search ── */
  const { q = "" } = Route.useSearch()

  const setQ = (value: string) =>
    navigate({ to: ".", search: { q: value }, replace: true })

  const { data: publishedCourses = [], isLoading } = useQuery({
    queryKey: ["published-courses"],
    queryFn: getPublishedCourses,
  })

  const { data: myCourses = [] } = useQuery({
    queryKey: ["student-enrolled-courses"],
    queryFn: getMyCourses,
  })

  const enrollMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-enrolled-courses"] })
    },
  })

  const enrolledCourseIds = new Set(myCourses.map((c: any) => c.courseId))
  const enrolledCount     = enrolledCourseIds.size
  const totalCourses      = publishedCourses.length
  const availableCount    = totalCourses - enrolledCount

  /* ── Client-side search filter ── */
  const filtered = useMemo(() => {
    if (!q.trim()) return publishedCourses
    const lower = q.toLowerCase()
    return publishedCourses.filter((c: any) =>
      c.title?.toLowerCase().includes(lower) ||
      c.description?.toLowerCase().includes(lower)
    )
  }, [publishedCourses, q])

  const showTips = !isLoading && totalCourses < 5

  return (
    <AppShell title="Courses">
      <div className="flex flex-col gap-6">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Courses",  value: totalCourses,   icon: BookOpen,     color: "text-primary"      },
            { label: "Enrolled",       value: enrolledCount,  icon: GraduationCap,color: "text-violet-600"   },
            { label: "Available",      value: availableCount, icon: CheckCircle2, color: "text-emerald-600"  },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon size={15} className={color} />
              </CardHeader>
              <CardContent>
                {isLoading
                  ? <Skeleton className="h-8 w-10" />
                  : <p className="text-3xl font-bold tracking-tight">{value}</p>
                }
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Header + Search ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Browse Courses</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {isLoading
                ? "Loading courses..."
                : `Showing ${filtered.length} of ${totalCourses} courses`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="pl-8 h-8 w-48 text-sm"
              />
            </div>
            {enrolledCount > 0 && (
              <Badge variant="secondary" className="gap-1.5 h-8 px-3">
                <GraduationCap size={13} />
                {enrolledCount} Enrolled
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* ── Course Grid ── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Skeletons */}
          {isLoading && Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}

          {/* Empty search result */}
          {!isLoading && filtered.length === 0 && publishedCourses.length > 0 && (
            <div className="col-span-full flex flex-col items-center py-12 text-muted-foreground text-center">
              <Search size={36} className="mb-3 opacity-20" />
              <p className="font-medium">No courses match "{q}"</p>
              <Button variant="ghost" size="sm" className="mt-3" onClick={() => setQ("")}>
                Clear search
              </Button>
            </div>
          )}

          {/* No courses at all */}
          {!isLoading && publishedCourses.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-12 text-muted-foreground text-center">
              <BookOpen size={36} className="mb-3 opacity-20" />
              <p className="font-medium">No courses available yet.</p>
              <p className="text-sm mt-1 opacity-70">Check back soon!</p>
            </div>
          )}

          {/* Course cards */}
          {!isLoading && filtered.map((course: any) => {
            const isEnrolled       = enrolledCourseIds.has(course.id)
            const isThisEnrolling  = enrollMutation.isPending && enrollMutation.variables === course.id

            return (
              <Card key={course.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
                    {isEnrolled && (
                      <Badge className="shrink-0 text-xs gap-1 text-emerald-600 bg-emerald-50 border-emerald-200">
                        <CheckCircle2 size={11} /> Enrolled
                      </Badge>
                    )}
                  </div>
                  {course.description && (
                    <CardDescription className="text-sm line-clamp-2 mt-1">
                      {course.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardFooter className="pt-0 mt-auto">
                  {!isEnrolled ? (
                    <Button
                      className="w-full"
                      onClick={() => enrollMutation.mutate(course.id)}
                      disabled={enrollMutation.isPending}
                    >
                      {isThisEnrolling ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() => navigate({ to: `/student/courses/${course.id}` })}
                    >
                      Continue Learning ▶
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* ── Tips fill dead space ── */}
        {showTips && totalCourses > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-widest">
                <Lightbulb size={13} /> Learning Tips
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="grid sm:grid-cols-3 gap-3">
                {TIPS.map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg border bg-muted/40 text-sm text-muted-foreground">
                    <Icon size={15} className="text-primary mt-0.5 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </AppShell>
  )
}