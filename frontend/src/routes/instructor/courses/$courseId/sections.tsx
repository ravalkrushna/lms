import { createFileRoute, useNavigate } from "@tanstack/react-router"
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

import {
  getSections,
  createSection,
  type Section,
} from "@/lib/instructor"

/* ── Route ── */
export const Route = createFileRoute(
  "/instructor/courses/$courseId/sections"
)({
  component: CourseSections,
})

function CourseSections() {
  const navigate = useNavigate()
  const { courseId } = Route.useParams()
  const queryClient = useQueryClient()

  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState("")

  /* ── Query ── */
  const { data: sections, isLoading } = useQuery<Section[]>({
    queryKey: ["instructor-sections", courseId],
    queryFn: () => getSections(Number(courseId)),
  })

  /* ── Create Mutation ── */
  const createMutation = useMutation({
    mutationFn: () => createSection(Number(courseId), { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instructor-sections", courseId],
      })
      setTitle("")
      setIsCreating(false)
    },
  })

  const totalSections = sections?.length ?? 0

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Course Sections</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organise your course by adding sections and lessons.
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
          >
            <Plus size={14} />
            Add Section
          </Button>
        </div>

        {/* ── Main Card ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Sections</CardTitle>
                <CardDescription className="mt-1">
                  {isLoading
                    ? "Loading..."
                    : `${totalSections} section${totalSections !== 1 ? "s" : ""} in this course`}
                </CardDescription>
              </div>
              {!isLoading && totalSections > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <LayoutList size={13} />
                  {totalSections} Sections
                </Badge>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5 space-y-4">

            {/* ── Create Section Inline Form ── */}
            {isCreating && (
              <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                <p className="text-sm font-medium">New Section</p>
                <Input
                  placeholder="e.g. Introduction to the Course"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && title.trim()) createMutation.mutate()
                    if (e.key === "Escape") setIsCreating(false)
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => createMutation.mutate()}
                    disabled={!title.trim() || createMutation.isPending}
                  >
                    <Check size={13} />
                    {createMutation.isPending ? "Saving..." : "Save Section"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5"
                    onClick={() => {
                      setIsCreating(false)
                      setTitle("")
                    }}
                  >
                    <X size={13} />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* ── Loading Skeletons ── */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            )}

            {/* ── Empty State ── */}
            {!isLoading && (!sections || sections.length === 0) && !isCreating && (
              <div className="flex flex-col items-center justify-center py-14 text-center text-muted-foreground">
                <BookOpen size={36} className="mb-3 opacity-20" />
                <p className="font-medium">No sections yet</p>
                <p className="text-sm mt-1 opacity-70">
                  Click "Add Section" to build your course curriculum.
                </p>
              </div>
            )}

            {/* ── Section List ── */}
            {!isLoading && sections && sections.length > 0 && (
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Section number */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{section.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Section {index + 1}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        navigate({
                          to: "/instructor/courses/$courseId/$sectionId/lessons",
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