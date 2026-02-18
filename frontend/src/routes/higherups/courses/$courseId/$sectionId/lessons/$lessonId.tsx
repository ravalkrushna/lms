import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"
import { getSectionLessons, type Lesson } from "@/lib/higherups"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute(
  "/higherups/courses/$courseId/$sectionId/lessons/$lessonId"
)({
  component: LessonViewer,
})

function LessonViewer() {
  const { sectionId, lessonId } = Route.useParams()

  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["higherups-lessons", sectionId],
    queryFn: () => getSectionLessons(Number(sectionId)),
  })

  const lesson = lessons?.find(
    l => String(l.id) === lessonId
  )

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30">

        <Card>
          <CardHeader>
            <CardTitle>
              {isLoading ? <Skeleton className="h-6 w-40" /> : lesson?.title}
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5">

            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : !lesson ? (
              <div className="text-muted-foreground text-sm">
                Lesson not found
              </div>
            ) : (
              <div className="space-y-4">

                {lesson.content && (
                  <p className="text-sm leading-relaxed">
                    {lesson.content}
                  </p>
                )}

                {lesson.videoUrl && (
                  <video
                    controls
                    className="w-full rounded-md border"
                    src={lesson.videoUrl}
                  />
                )}

              </div>
            )}

          </CardContent>
        </Card>

      </main>
    </div>
  )
}
