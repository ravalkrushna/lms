import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AppShell } from "@/components/AppShell"
import { getLessonDetail, completeLesson } from "@/lib/student"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export const Route = createFileRoute("/student/lessons/$lessonId")({
  component: LessonViewPage,
})

function LessonViewPage() {
  const { lessonId } = Route.useParams()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["lesson-detail", lessonId],
    queryFn: () => getLessonDetail(Number(lessonId)),
  })

  const completeMutation = useMutation({
    mutationFn: () => completeLesson(Number(lessonId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-detail", lessonId] })
      queryClient.invalidateQueries({ queryKey: ["course-detail"] }) 
    },
  })

  return (
    <AppShell title="Lesson 📖">

      {isLoading && (
        <p className="text-muted-foreground">
          Loading lesson...
        </p>
      )}

      {data && (
        <div className="space-y-6">

          {/* ✅ Title */}
          <h1 className="text-2xl font-semibold">
            {data.title}
          </h1>

          {/* ✅ Video */}
          {data.videoUrl && (
            <div className="rounded-xl overflow-hidden border">
              <iframe
                src={data.videoUrl.replace("watch?v=", "embed/")}
                className="w-full aspect-video"
                allowFullScreen
              />
            </div>
          )}

          {/* ✅ Content */}
          <div className="prose max-w-none dark:prose-invert">
            {data.content}
          </div>

          {/* ✅ Completion Button */}
          {!data.completed && (
            <Button
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              className="gap-2"
            >
              <CheckCircle size={18} />
              {completeMutation.isPending
                ? "Marking Complete..."
                : "Mark as Complete"}
            </Button>
          )}

          {data.completed && (
            <div className="flex items-center gap-2 text-green-500 font-medium">
              <CheckCircle size={18} />
              Completed 
            </div>
          )}

        </div>
      )}

    </AppShell>
  )
}
