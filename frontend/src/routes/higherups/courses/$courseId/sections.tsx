/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  getCourseSections,
  createSection,
  type Section,
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import {
  BookOpen,
  Plus,
  ChevronRight,
  LayoutList,
  X,
  Check,
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

  if (!numericCourseId) {
    console.error("Invalid courseId:", courseId)
    return null
  }

  const inputRef = useRef<HTMLInputElement>(null)

  /* ── Query ── */
  const { data: sections, isLoading } = useQuery<Section[]>({
    queryKey: ["higherups-sections", numericCourseId],
    queryFn: () => getCourseSections(numericCourseId),
  })

  /* ── Mutation ── */
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
      }

      navigate({
        to: "/higherups/courses/$courseId/$sectionId/lessons",
        params: {
          courseId,
          sectionId: String(newSection.id),
        },
      })
    },
  })

  function handleCreateSection() {
    const value = inputRef.current?.value?.trim()
    if (!value) return

    createMutation.mutate(value)
  }

  const totalSections = sections?.length ?? 0

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Course Sections
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organise your course structure.
            </p>
          </div>

          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => inputRef.current?.focus()}
          >
            <Plus size={14} />
            Add Section
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Sections</CardTitle>
                <CardDescription className="mt-1">
                  {isLoading
                    ? "Loading..."
                    : `${totalSections} section${totalSections !== 1 ? "s" : ""}`}
                </CardDescription>
              </div>

              {!isLoading && totalSections > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <LayoutList size={13} />
                  {totalSections}
                </Badge>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5 space-y-4">

            {/* ── Inline Creator (Always Visible = Modern UX) */}
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
              <p className="text-sm font-medium">New Section</p>

              <Input
                ref={inputRef}
                placeholder="Section title"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateSection()
                  }
                }}
              />

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={handleCreateSection}
                  disabled={createMutation.isPending}
                >
                  <Check size={13} />
                  Save Section
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.value = ""
                    }
                  }}
                >
                  <X size={13} />
                  Clear
                </Button>
              </div>
            </div>

            {/* ── Loading */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            )}

            {/* ── Empty */}
            {!isLoading && totalSections === 0 && (
              <div className="flex flex-col items-center py-10 text-muted-foreground">
                <BookOpen size={36} className="mb-3 opacity-20" />
                <p>No sections yet</p>
              </div>
            )}

            {/* ── List */}
            {!isLoading && sections && sections.length > 0 && (
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>

                      <p className="text-sm font-medium">
                        {section.title}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
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
                      Lessons
                      <ChevronRight size={14} />
                    </Button>
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
