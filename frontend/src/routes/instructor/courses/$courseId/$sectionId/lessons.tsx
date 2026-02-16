import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { InstructorSidebar } from "@/components/InstructorSidebar"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  getLessons,
  createLesson,
  type Lesson,
} from "@/lib/instructor"

/* ---------------- ROUTE ---------------- */

export const Route = createFileRoute(
  "/instructor/courses/$courseId/$sectionId/lessons"
)({
  component: SectionLessons,
})

function SectionLessons() {
  const { sectionId } = Route.useParams()
  const queryClient = useQueryClient()

  const [isCreating, setIsCreating] = useState(false)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isFreePreview, setIsFreePreview] = useState(false)

  /* ---------------- QUERY ---------------- */

  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["instructor-lessons", sectionId],
    queryFn: () => getLessons(Number(sectionId)),
  })

  /* ---------------- CREATE LESSON ---------------- */

  const createMutation = useMutation({
    mutationFn: () =>
      createLesson(Number(sectionId), {
        title,
        content,
        videoUrl,
        isFreePreview,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instructor-lessons", sectionId],
      })

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

  return (
    <div className="flex min-h-screen bg-white">

      <InstructorSidebar />

      <main className="flex-1 p-6 space-y-6">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lessons Management 🎬</CardTitle>

            <Button size="sm" onClick={() => setIsCreating(true)}>
              Add Lesson +
            </Button>
          </CardHeader>

          <CardContent>

            {/* ✅ CREATE LESSON FORM */}
            {isCreating && (
              <div className="p-4 border rounded-md bg-muted/40 space-y-3 mb-6">

                <Input
                  placeholder="Lesson title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                  placeholder="Lesson content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <Input
                  placeholder="Video URL..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isFreePreview}
                    onChange={(e) => setIsFreePreview(e.target.checked)}
                  />
                  Free Preview
                </label>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => createMutation.mutate()}
                    disabled={!title.trim()}
                  >
                    Save Lesson
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* ✅ STATES */}
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading lessons...
              </p>
            )}

            {!isLoading && (!lessons || lessons.length === 0) && (
              <EmptyState />
            )}

            {!isLoading && lessons && (
              <div className="space-y-3">

                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-3 border rounded-md flex justify-between"
                  >
                    <span className="text-sm font-medium">
                      {lesson.title}
                    </span>

                    {lesson.isFreePreview && (
                      <span className="text-xs text-emerald-600">
                        Preview
                      </span>
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

/* ---------------- EMPTY STATE ---------------- */

function EmptyState() {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <div>No lessons yet</div>
      <div className="text-sm">
        Add your first lesson 🚀
      </div>
    </div>
  )
}
