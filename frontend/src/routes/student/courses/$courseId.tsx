/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { AppShell } from "@/components/AppShell"
import { getCourseDetail, enrollCourse } from "@/lib/student"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  GraduationCap,
  ChevronDown,
  Lock,
  Clock,
  LayoutList,
  Sparkles,
} from "lucide-react"

import { useState } from "react"

export const Route = createFileRoute("/student/courses/$courseId")({
  component: CourseDetailPage,
})

/* ── Types ── */
type Lesson = {
  lessonId: number
  title: string
  completed: boolean
}

type Section = {
  sectionId: number
  title: string
  lessons: Lesson[]
}

type CourseDetail = {
  courseId: number
  title: string
  sections: Section[]
}

/* ── Skeleton Loader ── */
function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <Card>
        <CardHeader className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <div className="flex gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-3 w-full" />
        </CardHeader>
      </Card>

      {/* Section skeletons */}
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-14 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* ── Section Card ── */
function SectionCard({
  section,
  index,
  navigate,
}: {
  section: Section
  index: number
  navigate: any
}) {
  const [open, setOpen] = useState(true)

  const completed = section.lessons.filter((l) => l.completed).length
  const total = section.lessons.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone = completed === total && total > 0

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {/* Section Header */}
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer select-none hover:bg-muted/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Section number bubble */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                  {index + 1}
                </div>

                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen size={16} className="text-primary" />
                    {section.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {completed}/{total} lessons completed
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {allDone && (
                  <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200 text-xs gap-1">
                    <CheckCircle2 size={12} />
                    Done
                  </Badge>
                )}
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* Progress bar */}
            <Progress value={progress} className="h-1.5 mt-3" />
          </CardHeader>
        </CollapsibleTrigger>

        {/* Lesson List */}
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3">
            <Separator className="mb-3" />
            <div className="space-y-1.5">
              {section.lessons.map((lesson, lessonIdx) => (
                <div
                  key={lesson.lessonId}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all cursor-pointer group
                    ${
                      lesson.completed
                        ? "bg-green-50/50 border-green-100 hover:bg-green-50"
                        : "hover:bg-accent hover:border-accent-foreground/10"
                    }`}
                  onClick={() =>
                    navigate({ to: `/student/lessons/${lesson.lessonId}` })
                  }
                >
                  <div className="flex items-center gap-3">
                    {/* Lesson number */}
                    <span className="text-xs text-muted-foreground w-5 text-center font-mono">
                      {lessonIdx + 1}
                    </span>

                    {lesson.completed ? (
                      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    ) : (
                      <PlayCircle
                        size={18}
                        className="text-primary shrink-0 group-hover:scale-110 transition-transform"
                      />
                    )}

                    <span
                      className={`text-sm font-medium ${
                        lesson.completed ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {lesson.title}
                    </span>
                  </div>

                  {lesson.completed ? (
                    <Badge
                      variant="secondary"
                      className="text-xs text-green-600 bg-green-50 border-green-200"
                    >
                      Completed
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      Start →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

/* ── Main Page ── */
function CourseDetailPage() {
  const { courseId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<CourseDetail>({
    queryKey: ["course-detail", courseId],
    queryFn: () => getCourseDetail(Number(courseId)),
    retry: false,
  })

  const isForbidden = (error as any)?.response?.status === 403

  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(Number(courseId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-detail", courseId] })
      queryClient.invalidateQueries({ queryKey: ["student-enrolled-courses"] })
      queryClient.invalidateQueries({ queryKey: ["my-courses"] })
    },
  })

  /* Compute overall stats */
  const totalLessons = data?.sections.flatMap((s) => s.lessons).length ?? 0
  const completedLessons =
    data?.sections
      .flatMap((s) => s.lessons)
      .filter((l) => l.completed).length ?? 0
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <AppShell title="Course Detail 📚">

      {/* ── Loading ── */}
      {isLoading && <CourseDetailSkeleton />}

      {/* ── Not Enrolled (403) ── */}
      {isForbidden && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full shadow-lg border-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock size={28} className="text-primary" />
              </div>
              <CardTitle className="text-xl">Course Locked</CardTitle>
              <CardDescription className="mt-2">
                Enroll in this course to access all lessons and track your progress.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Perks */}
              <div className="space-y-2 text-sm text-muted-foreground">
                {[
                  { icon: <PlayCircle size={15} />, text: "Full access to all lessons" },
                  { icon: <CheckCircle2 size={15} />, text: "Track your completion progress" },
                  { icon: <GraduationCap size={15} />, text: "Earn a certificate on completion" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-primary">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <Separator />

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => enrollMutation.mutate()}
                disabled={enrollMutation.isPending}
              >
                <Sparkles size={16} />
                {enrollMutation.isPending ? "Enrolling..." : "Enroll Now — It's Free"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Course Content ── */}
      {data && (
        <div className="space-y-6">

          {/* ── Course Header Card ── */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <CardTitle className="text-2xl leading-tight">
                    {data.title}
                  </CardTitle>
                  <CardDescription>
                    Your learning progress at a glance
                  </CardDescription>
                </div>

                <Badge
                  variant={overallProgress === 100 ? "default" : "secondary"}
                  className="text-sm px-3 py-1 gap-1"
                >
                  {overallProgress === 100 ? (
                    <><CheckCircle2 size={14} /> Completed</>
                  ) : (
                    <><Clock size={14} /> In Progress</>
                  )}
                </Badge>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <LayoutList size={15} className="text-primary" />
                  {data.sections.length} Sections
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle size={15} className="text-primary" />
                  {totalLessons} Lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-green-500" />
                  {completedLessons} Completed
                </span>
              </div>

              {/* Overall progress */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Overall Progress</span>
                  <span className="font-semibold text-foreground">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          {/* ── Empty Curriculum ── */}
          {data.sections.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen size={40} className="text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground font-medium">No sections yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Course content is being prepared. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}

          {/* ── Sections ── */}
          <div className="grid gap-4">
            {data.sections.map((section, index) => (
              <SectionCard
                key={section.sectionId}
                section={section}
                index={index}
                navigate={navigate}
              />
            ))}
          </div>

        </div>
      )}
    </AppShell>
  )
}