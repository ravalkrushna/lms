/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { motion } from "framer-motion"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  getCourseSections,
  createSection,
  type Section,
} from "@/lib/higherups"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import {
  X,
  Check,
  Layers,
} from "lucide-react"

/* ── Route ── */
export const Route = createFileRoute(
  "/higherups/courses/$courseId/sections"
)({
  component: CourseSections,
})

function CourseSections() {
  const navigate = useNavigate()
  const { courseId } = Route.useParams()
  const queryClient = useQueryClient()

  const numericCourseId = Number(courseId)
  if (!numericCourseId) return null

  const inputRef = useRef<HTMLInputElement>(null)

  const { data: sections, isLoading } = useQuery<Section[]>({
    queryKey: ["higherups-sections", numericCourseId],
    queryFn: () => getCourseSections(numericCourseId),
  })

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      createSection(numericCourseId, title),

    onSuccess: (newSection) => {
      queryClient.setQueryData<Section[]>(
        ["higherups-sections", numericCourseId],
        (old = []) => [...old, newSection]
      )

      if (inputRef.current) {
        inputRef.current.value = ""
        inputRef.current.focus()
      }
    },
  })

  function handleCreateSection() {
    const value = inputRef.current?.value?.trim()
    if (!value) return

    createMutation.mutate(value)
  }

  const totalSections = sections?.length ?? 0

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
              <Layers size={20} />
              Course Sections
            </h1>

            <p className="text-muted-foreground mt-1">
              Structure your learning experience
            </p>
          </div>

          {/* ── PRIMARY CREATOR ⭐⭐⭐ */}
          <motion.div
            layout
            className="rounded-3xl border bg-background p-6 shadow-sm space-y-4"
          >
            <p className="text-sm font-semibold">
              Create New Section
            </p>

            <div className="flex gap-2">

              <Input
                ref={inputRef}
                placeholder="Enter section title..."
                className="h-11"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateSection()
                  }
                }}
              />

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleCreateSection}
                  disabled={createMutation.isPending}
                  className="h-11 px-5"
                >
                  <Check size={14} />
                </Button>
              </motion.div>

              <Button
                variant="ghost"
                className="h-11"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = ""
                    inputRef.current.focus()
                  }
                }}
              >
                <X size={14} />
              </Button>

            </div>
          </motion.div>

          {/* ── SECTIONS LIST */}
          <div className="space-y-3">

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {isLoading
                  ? "Loading..."
                  : `${totalSections} section${totalSections !== 1 ? "s" : ""}`}
              </p>
            </div>

            {isLoading ? (
              <>
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </>
            ) : totalSections === 0 ? (
              <div className="rounded-2xl border bg-background p-10 text-center text-muted-foreground">
                No sections yet
              </div>
            ) : (
              sections!.map((section, index) => (
                <motion.div
                  key={section.id}
                  whileHover={{ scale: 1.01 }}
                  className="group rounded-2xl border bg-background p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">

                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {section.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Section workspace
                      </p>
                    </div>
                  </div>

                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="secondary"
                      className="opacity-70 group-hover:opacity-100 transition"
                      onClick={() =>
                        navigate({
                          to: "/higherups/courses/$courseId/$sectionId/lessons",
                          params: {
                            courseId,
                            sectionId: String(section.id),
                          },
                        })
                      }
                    >
                      Open →
                    </Button>
                  </motion.div>
                </motion.div>
              ))
            )}

          </div>
        </motion.div>
      </main>
    </div>
  )
}