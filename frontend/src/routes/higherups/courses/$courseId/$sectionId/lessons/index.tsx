/* eslint-disable react-hooks/incompatible-library */
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  getSectionLessons,
  createLesson,
  type Lesson,
} from "@/lib/higherups"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"

import {
  Plus,
  Video,
  Eye,
  Sparkles,
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
    <div className="flex min-h-screen bg-muted/50">
      <HigherupsSidebar />

      <main className="flex-1">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto p-8 space-y-8"
        >

          {/* ── HERO HEADER */}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles size={20} />
              Lessons
            </h1>

            <p className="text-muted-foreground mt-1">
              Build your learning experience
            </p>
          </div>

          {/* ── PRIMARY CREATOR ⭐⭐⭐ */}
          <motion.form
            layout
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-3xl border bg-background p-6 shadow-sm space-y-5"
          >
            <p className="text-sm font-semibold">
              Create New Lesson
            </p>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Lesson Title</Label>
                <Input {...form.register("title")} />
              </div>

              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input {...form.register("videoUrl")} />
              </div>

            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea {...form.register("content")} />
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

            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="shadow-sm"
              >
                <Plus size={14} className="mr-2" />
                {createMutation.isPending ? "Saving..." : "Add Lesson"}
              </Button>
            </motion.div>
          </motion.form>

          {/* ── LESSONS LIST */}
          <div className="space-y-3">

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {isLoading
                  ? "Loading..."
                  : `${totalLessons} lesson${totalLessons !== 1 ? "s" : ""}${freePreviews ? ` · ${freePreviews} free preview` : ""}`}
              </p>
            </div>

            {isLoading ? (
              <>
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </>
            ) : totalLessons === 0 ? (
              <div className="rounded-2xl border bg-background p-10 text-center text-muted-foreground">
                No lessons yet
              </div>
            ) : (
              lessons!.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  whileHover={{ scale: 1.01 }}
                  className="group rounded-2xl border bg-background p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">

                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {lesson.title}
                      </p>

                      {lesson.videoUrl && (
                        <p className="text-xs text-blue-500 flex items-center gap-1">
                          <Video size={11} />
                          Video attached
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">

                    {lesson.isFreePreview && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <Eye size={11} className="mr-1" />
                        Free Preview
                      </Badge>
                    )}

                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="secondary"
                        className="opacity-70 group-hover:opacity-100 transition"
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
                        Open →
                      </Button>
                    </motion.div>

                  </div>
                </motion.div>
              ))
            )}

          </div>
        </motion.div>
      </main>
    </div>
  )
}