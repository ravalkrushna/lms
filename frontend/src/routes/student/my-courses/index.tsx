/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AppShell } from "@/components/AppShell"
import { getMyCourses } from "@/lib/student"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Activity,
  Lightbulb,
  Star,
  PlayCircle,
} from "lucide-react"

export const Route = createFileRoute("/student/my-courses/")({
  component: MyCoursesPage,
})

const TIPS = [
  { icon: PlayCircle,   text: "Pick up where you left off — consistency beats intensity." },
  { icon: Star,         text: "Aim to complete at least one lesson every day."            },
  { icon: Lightbulb,    text: "Review completed lessons to reinforce what you've learned."},
]

function MyCoursesPage() {
  const navigate  = useNavigate()

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["my-courses"],
    queryFn: getMyCourses,
  })

  const total     = courses.length
  const completed = courses.filter((c: any) => c.progressPercent === 100).length
  const inProgress= courses.filter((c: any) => c.progressPercent > 0 && c.progressPercent < 100).length
  const notStarted= courses.filter((c: any) => c.progressPercent === 0).length

  const showTips  = !isLoading && total < 4

  return (
    <AppShell title="My Courses">
      <div className="flex flex-col gap-6">

        {/* ── Stat row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Enrolled",    value: total,       icon: BookOpen,     color: "text-primary",      bg: "" },
            { label: "In Progress", value: inProgress,  icon: Activity,     color: "text-violet-600",   bg: "" },
            { label: "Completed",   value: completed,   icon: CheckCircle2, color: "text-emerald-600",  bg: "" },
            { label: "Not Started", value: notStarted,  icon: GraduationCap,color: "text-muted-foreground", bg: "" },
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

        {/* ── Course grid ── */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && courses.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <GraduationCap size={40} className="mb-3 opacity-20" />
              <p className="font-medium text-foreground">No enrolled courses yet</p>
              <p className="text-sm mt-1 opacity-70">Browse courses and start learning!</p>
              <Button
                className="mt-4 gap-2"
                onClick={() => navigate({ to: "/student/courses" })}
              >
                <BookOpen size={15} />
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Course cards ── */}
        {!isLoading && courses.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course: any) => {
              const pct      = course.progressPercent ?? 0
              const isDone   = pct === 100
              const started  = pct > 0

              return (
                <Card key={course.courseId} className="flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
                      {isDone && (
                        <Badge className="shrink-0 gap-1 text-xs text-emerald-600 bg-emerald-50 border-emerald-200">
                          <CheckCircle2 size={11} /> Done
                        </Badge>
                      )}
                      {!isDone && started && (
                        <Badge variant="secondary" className="shrink-0 gap-1 text-xs text-violet-600 bg-violet-50 border-violet-200">
                          <Activity size={11} /> Active
                        </Badge>
                      )}
                      {!isDone && !started && (
                        <Badge variant="outline" className="shrink-0 text-xs text-muted-foreground">
                          Not started
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center justify-between mt-1">
                      <span>Progress</span>
                      <span className="font-semibold text-foreground">{pct}%</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <Progress value={pct} className="h-2" />
                  </CardContent>

                  <CardFooter className="pt-0 mt-auto">
                    <Button
                      className="w-full gap-2"
                      variant={isDone ? "secondary" : "default"}
                      onClick={() => navigate({ to: `/student/courses/${course.courseId}` })}
                    >
                      <TrendingUp size={15} />
                      {isDone ? "Review Course" : "Continue Learning"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        {/* ── Tips fill dead space when few courses ── */}
        {showTips && courses.length > 0 && (
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