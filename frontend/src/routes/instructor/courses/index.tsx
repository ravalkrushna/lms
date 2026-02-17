import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { z } from "zod"

import { InstructorSidebar } from "@/components/InstructorSidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  getInstructorCourses,
  publishCourse,
  unpublishCourse,
  type InstructorCourse,
} from "@/lib/instructor"

import {
  Search,
  Plus,
  BookOpen,
  Globe,
  FileText,
  LayoutList,
  Lightbulb,
  Star,
  TrendingUp,
} from "lucide-react"

/* ── Search schema ── */
const coursesSearchSchema = z.object({
  search: z.string().optional().catch(""),
  status: z.enum(["ALL", "DRAFT", "PUBLISHED"]).optional().catch("ALL"),
})

export const Route = createFileRoute("/instructor/courses/")({
  component: InstructorCourses,
  validateSearch: coursesSearchSchema,
})

const TIPS = [
  { icon: Lightbulb,   text: "Break your course into clear sections and lessons for a better student experience." },
  { icon: Star,        text: "Publish your course once all sections and lessons are ready." },
  { icon: TrendingUp,  text: "Add a detailed description to attract more students." },
]

function InstructorCourses() {
  const navigate = useNavigate()

  /* ── All state lives in the URL ── */
  const { search: searchQuery = "", status: activeFilter = "ALL" } = Route.useSearch()

  const { data: courses, isLoading } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: getInstructorCourses,
  })

  const filteredCourses = useMemo(() => {
    if (!courses) return []
    let result = courses
    if (activeFilter !== "ALL") result = result.filter(c => c.status === activeFilter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c => c.title.toLowerCase().includes(q))
    }
    return result
  }, [courses, activeFilter, searchQuery])

  const stats = useMemo(() => {
    if (!courses) return { total: 0, published: 0, draft: 0 }
    return {
      total:     courses.length,
      published: courses.filter(c => c.status === "PUBLISHED").length,
      draft:     courses.filter(c => c.status === "DRAFT").length,
    }
  }, [courses])

  /* ── Helpers — update URL search params directly ── */
  const setSearch = (value: string) =>
    navigate({ to: ".", search: { search: value, status: activeFilter }, replace: true })

  const setFilter = (status: "ALL" | "DRAFT" | "PUBLISHED") =>
    navigate({ to: ".", search: { search: searchQuery, status } })

  const clearFilters = () =>
    navigate({ to: ".", search: { search: "", status: "ALL" } })

  const isFiltered  = !!searchQuery || activeFilter !== "ALL"
  const showTips    = !isLoading && (courses?.length ?? 0) < 4

  const filters = [
    { label: "All",       value: "ALL"       },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft",     value: "DRAFT"     },
  ] as const

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />

      <main className="flex-1 p-6 bg-muted/30 flex flex-col gap-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage and publish your courses.
            </p>
          </div>
          <Button
            className="gap-1.5"
            onClick={() => navigate({ to: "/instructor/courses/create" })}
          >
            <Plus size={15} />
            New Course
          </Button>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Courses", value: stats.total,     icon: LayoutList, color: "text-primary"     },
            { label: "Published",     value: stats.published, icon: Globe,      color: "text-emerald-600" },
            { label: "Drafts",        value: stats.draft,     icon: FileText,   color: "text-amber-500"   },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon size={16} className={color} />
              </CardHeader>
              <CardContent>
                {isLoading
                  ? <Skeleton className="h-8 w-12" />
                  : <p className="text-3xl font-bold">{value}</p>
                }
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Table card ── */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">All Courses</CardTitle>
                <CardDescription className="mt-0.5">
                  {isLoading
                    ? "Loading..."
                    : `Showing ${filteredCourses.length} of ${stats.total} courses`}
                </CardDescription>
              </div>

              {/* Search + filters — all wired to URL */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 h-8 w-48 text-sm"
                  />
                </div>

                <div className="flex gap-1.5">
                  {filters.map(filter => (
                    <Button
                      key={filter.value}
                      variant={activeFilter === filter.value ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs gap-1"
                      onClick={() => setFilter(filter.value)}
                    >
                      {filter.label}
                      {filter.value !== "ALL" && (
                        <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-[10px]">
                          {filter.value === "PUBLISHED" ? stats.published : stats.draft}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>

                {isFiltered && (
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0 flex flex-col flex-1">

            {/* Loading */}
            {isLoading && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3].map(i => (
                    <TableRow key={i}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-7 w-28 rounded-md" /></TableCell>
                      <TableCell className="pr-6 text-right">
                        <Skeleton className="h-7 w-16 ml-auto rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Empty */}
            {!isLoading && filteredCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-16 text-center text-muted-foreground">
                <BookOpen size={36} className="mb-3 opacity-20" />
                <p className="font-medium">No courses found</p>
                <p className="text-sm mt-1 opacity-70">
                  {isFiltered ? "Try adjusting your search or filters." : "Create your first course to get started."}
                </p>
                {isFiltered && (
                  <Button variant="ghost" size="sm" className="mt-3" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {/* Table */}
            {!isLoading && filteredCourses.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-6">Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
                            <BookOpen size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{course.title}</p>
                            <p className="text-xs text-muted-foreground font-mono">ID: {course.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusControl course={course} />
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1.5"
                          onClick={() => navigate({
                            to: "/instructor/courses/$courseId/sections",
                            params: { courseId: String(course.id) },
                          })}
                        >
                          Manage →
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Tips fill dead space */}
            {showTips && (
              <>
                <Separator />
                <div className="p-5 bg-muted/20 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-3">
                    <Lightbulb size={12} /> Course Tips
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {TIPS.map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg border bg-background text-sm text-muted-foreground">
                        <Icon size={15} className="text-primary mt-0.5 shrink-0" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </CardContent>
        </Card>

      </main>
    </div>
  )
}

/* ── Status Select ── */
function StatusControl({ course }: { course: InstructorCourse }) {
  const queryClient = useQueryClient()

  const publish = useMutation({
    mutationFn: () => publishCourse(course.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instructor-courses"] }),
  })

  const unpublish = useMutation({
    mutationFn: () => unpublishCourse(course.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instructor-courses"] }),
  })

  return (
    <Select
      value={course.status}
      disabled={publish.isPending || unpublish.isPending}
      onValueChange={(value) => {
        if (value === "PUBLISHED") publish.mutate()
        if (value === "DRAFT")     unpublish.mutate()
      }}
    >
      <SelectTrigger className="w-32 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="DRAFT">
          <span className="flex items-center gap-1.5">
            <FileText size={12} className="text-amber-500" /> Draft
          </span>
        </SelectItem>
        <SelectItem value="PUBLISHED">
          <span className="flex items-center gap-1.5">
            <Globe size={12} className="text-emerald-600" /> Published
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}