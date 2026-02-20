/* Clean Adaptive Lesson Viewer */

import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"
import { getSectionLessons, type Lesson } from "@/lib/higherups"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

import {
  Video,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react"

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

  const isDirectVideo =
    lesson?.videoUrl?.match(/\.(mp4|webm|ogg)$/i)

  return (
    <div className="flex min-h-screen bg-muted/50">
      <HigherupsSidebar />

      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto p-8 space-y-6"
        >

          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-3xl" />
          ) : !lesson ? (
            <div className="text-muted-foreground">
              Lesson not found
            </div>
          ) : (
            <>
              {/* ── HEADER */}
              <div>
                <h1 className="text-3xl font-bold">
                  {lesson.title}
                </h1>

                <div className="mt-3 flex gap-2 flex-wrap">

                  {lesson.content && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <FileText size={12} className="mr-1" />
                      Content Lesson
                    </Badge>
                  )}

                  {lesson.videoUrl && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      <Video size={12} className="mr-1" />
                      Video Lesson
                    </Badge>
                  )}

                  {lesson.isFreePreview && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      <Eye size={12} className="mr-1" />
                      Free Preview
                    </Badge>
                  )}

                </div>
              </div>

              {/* ── EMBEDDABLE VIDEO ⭐⭐⭐ */}
              {lesson.videoUrl && isDirectVideo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl overflow-hidden border bg-black shadow-sm"
                >
                  <video
                    controls
                    className="w-full"
                    src={lesson.videoUrl}
                  />
                </motion.div>
              )}

              {/* ── NON-EMBEDDABLE VIDEO ⭐⭐⭐ */}
              {lesson.videoUrl && !isDirectVideo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border bg-background p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Video Content
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cannot be previewed inline
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      window.open(lesson.videoUrl, "_blank")
                    }
                  >
                    <ExternalLink size={14} className="mr-2" />
                    Open Video
                  </Button>
                </motion.div>
              )}

              {/* ── CONTENT ⭐⭐⭐ */}
              {lesson.content && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border bg-background p-8 shadow-sm"
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {lesson.content}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}