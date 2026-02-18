/* eslint-disable react-hooks/incompatible-library */
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  getSectionLessons,
  createLesson,
  type Lesson,
} from "@/lib/higherups"

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
  PlayCircle,
  Plus,
  Video,
  Eye,
  BookOpen,
} from "lucide-react"

/* ── Route ── */
export const Route = createFileRoute(
  "/higherups/courses/$courseId/$sectionId/lessons/"
)({
  component: SectionLessons,
})

type LessonForm = {
  title: string
  content?: string
  videoUrl?: string
  isFreePreview: boolean
}

function SectionLessons() {

  /* ⭐ REQUIRED FOR NAVIGATION */
  const navigate = Route.useNavigate()
  const { courseId, sectionId } = Route.useParams()

  const queryClient = useQueryClient()

  const form = useForm<LessonForm>({
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
      isFreePreview: false,
    },
  })

  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["higherups-lessons", sectionId],
    queryFn: () => getSectionLessons(Number(sectionId)),
  })

  const createMutation = useMutation({
    mutationFn: (data: LessonForm) =>
      createLesson(Number(sectionId), data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["higherups-lessons", sectionId],
      })

      form.reset()
    },
  })

  const totalLessons = lessons?.length ?? 0
  const freePreviews = lessons?.filter(l => l.isFreePreview).length ?? 0

  function onSubmit(data: LessonForm) {
    if (!data.title.trim()) return
    createMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Lessons
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build section learning content.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-base">
                  Section Lessons
                </CardTitle>

                <CardDescription className="mt-1">
                  {isLoading
                    ? "Loading..."
                    : `${totalLessons} lesson${totalLessons !== 1 ? "s" : ""}${freePreviews ? ` · ${freePreviews} free preview` : ""}`}
                </CardDescription>
              </div>

              {!isLoading && totalLessons > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <PlayCircle size={13} />
                  {totalLessons}
                </Badge>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5 space-y-6">

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border bg-muted/40 p-4 space-y-4"
            >
              <p className="text-sm font-semibold">
                New Lesson
              </p>

              <div className="space-y-2">
                <Label>Lesson Title</Label>
                <Input {...form.register("title")} />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea {...form.register("content")} />
              </div>

              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input {...form.register("videoUrl")} />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.watch("isFreePreview")}
                  onCheckedChange={v =>
                    form.setValue("isFreePreview", Boolean(v))
                  }
                />
                <Label>Free Preview</Label>
              </div>

              <Button
                size="sm"
                type="submit"
                disabled={createMutation.isPending}
              >
                <Plus size={14} className="mr-2" />
                {createMutation.isPending ? "Saving..." : "Add Lesson"}
              </Button>
            </form>

            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            )}

            {!isLoading && totalLessons === 0 && (
              <div className="flex flex-col items-center py-10 text-muted-foreground">
                <BookOpen size={36} className="mb-3 opacity-20" />
                <p>No lessons yet</p>
              </div>
            )}

            {!isLoading && lessons && lessons.length > 0 && (
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {lesson.title}
                        </p>

                        {lesson.videoUrl && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Video size={11} />
                            Video attached
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ⭐ RIGHT SIDE */}
                    <div className="flex items-center gap-2">

                      {lesson.isFreePreview && (
                        <Badge
                          variant="secondary"
                          className="gap-1 text-xs"
                        >
                          <Eye size={11} />
                          Free Preview
                        </Badge>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate({
                            to: "/higherups/courses/$courseId/$sectionId/lessons/$lessonId",
                            params: {
                              courseId,
                              sectionId,
                              lessonId: String(lesson.id),
                            },
                          })
                        }
                      >
                        View
                      </Button>

                    </div>
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
