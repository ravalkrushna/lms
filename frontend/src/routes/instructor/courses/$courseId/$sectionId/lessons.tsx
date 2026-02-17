import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { InstructorSidebar } from "@/components/InstructorSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"

import {
  getLessons,
  createLesson,
  type Lesson,
} from "@/lib/instructor"

import {
  PlayCircle,
  Plus,
  X,
  Check,
  Video,
  Eye,
  BookOpen,
} from "lucide-react"

/* ── Route ── */
export const Route = createFileRoute(
  "/instructor/courses/$courseId/$sectionId/lessons"
)({
  component: SectionLessons,
})

function SectionLessons() {
  const { sectionId } = Route.useParams()
  const queryClient = useQueryClient()

  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle]           = useState("")
  const [content, setContent]       = useState("")
  const [videoUrl, setVideoUrl]     = useState("")
  const [isFreePreview, setIsFreePreview] = useState(false)

  /* ── Query ── */
  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["instructor-lessons", sectionId],
    queryFn: () => getLessons(Number(sectionId)),
  })

  /* ── Create Mutation ── */
  const createMutation = useMutation({
    mutationFn: () =>
      createLesson(Number(sectionId), { title, content, videoUrl, isFreePreview }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-lessons", sectionId] })
      resetForm()
      setIsCreating(false)
    },
  })

  function resetForm() {
    setTitle("")
    setContent("")
    setVideoUrl("")
    setIsFreePreview(false)
  }

  const totalLessons   = lessons?.length ?? 0
  const freePreviews   = lessons?.filter((l) => l.isFreePreview).length ?? 0

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lessons</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add and manage lessons for this section.
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          >
            <Plus size={14} />
            Add Lesson
          </Button>
        </div>

        {/* ── Main Card ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Section Lessons</CardTitle>
                <CardDescription className="mt-1">
                  {isLoading
                    ? "Loading..."
                    : `${totalLessons} lesson${totalLessons !== 1 ? "s" : ""}${freePreviews > 0 ? ` · ${freePreviews} free preview` : ""}`}
                </CardDescription>
              </div>
              {!isLoading && totalLessons > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <PlayCircle size={13} />
                  {totalLessons} Lessons
                </Badge>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5 space-y-4">

            {/* ── Create Lesson Form ── */}
            {isCreating && (
              <div className="rounded-lg border bg-muted/40 p-4 space-y-4">
                <p className="text-sm font-semibold">New Lesson</p>

                {/* Title */}
                <div className="space-y-2">
                  <Label>
                    Lesson Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Introduction to Variables"
                    value={title}
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Lesson notes or description..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="resize-none min-h-24"
                  />
                </div>

                {/* Video URL */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Video size={13} />
                    Video URL
                  </Label>
                  <Input
                    placeholder="https://..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>

                {/* Free Preview toggle */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="free-preview"
                    checked={isFreePreview}
                    onCheckedChange={(v) => setIsFreePreview(Boolean(v))}
                  />
                  <Label htmlFor="free-preview" className="cursor-pointer text-sm font-normal">
                    Make this lesson a free preview
                  </Label>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => createMutation.mutate()}
                    disabled={!title.trim() || createMutation.isPending}
                  >
                    <Check size={13} />
                    {createMutation.isPending ? "Saving..." : "Save Lesson"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5"
                    onClick={() => { setIsCreating(false); resetForm() }}
                  >
                    <X size={13} />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* ── Skeletons ── */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-4 w-44" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            )}

            {/* ── Empty State ── */}
            {!isLoading && (!lessons || lessons.length === 0) && !isCreating && (
              <div className="flex flex-col items-center justify-center py-14 text-center text-muted-foreground">
                <BookOpen size={36} className="mb-3 opacity-20" />
                <p className="font-medium">No lessons yet</p>
                <p className="text-sm mt-1 opacity-70">
                  Click "Add Lesson" to start building this section.
                </p>
              </div>
            )}

            {/* ── Lesson List ── */}
            {!isLoading && lessons && lessons.length > 0 && (
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Lesson number */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{lesson.title}</p>
                        {lesson.videoUrl && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Video size={11} />
                            Video attached
                          </p>
                        )}
                      </div>
                    </div>

                    {lesson.isFreePreview && (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-emerald-600 bg-emerald-50 border-emerald-200 text-xs"
                      >
                        <Eye size={11} />
                        Free Preview
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

          </CardContent>
        </Card>

      </main>
    </div>
  )
}