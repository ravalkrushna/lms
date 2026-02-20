/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import {
  BookOpen,
  CheckCircle2,
  FileText,
  Archive,
  Users,
  PlusCircle,
  Eye,
} from "lucide-react"

import { getInstructorCourses } from "@/lib/higherups"

export const Route = createFileRoute("/higherups/mycourses/")({
  component: InstructorMyCoursesPage,
})

// ─── Status styles ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DRAFT:     "bg-yellow-100 text-yellow-700 border-yellow-200",
  ARCHIVED:  "bg-red-100 text-red-700 border-red-200",
}

const ROW_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 hover:bg-emerald-100 border-b border-emerald-100",
  DRAFT:     "bg-yellow-50 hover:bg-yellow-100 border-b border-yellow-100",
  ARCHIVED:  "bg-red-50 hover:bg-red-100 border-b border-red-100",
}

const ICON_STYLES: Record<string, string> = {
  PUBLISHED: "text-emerald-500",
  DRAFT:     "text-yellow-500",
  ARCHIVED:  "text-red-400",
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function InstructorMyCoursesPage() {
  const navigate = useNavigate()

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: getInstructorCourses,
  })

  const total     = courses.length
  const published = courses.filter((c: any) => c.status === "PUBLISHED").length
  const drafts    = courses.filter((c: any) => c.status === "DRAFT").length
  const archived  = courses.filter((c: any) => c.status === "ARCHIVED").length

  return (
    <div className="flex min-h-screen bg-background">
      <HigherupsSidebar />

      <main className="flex-1 min-w-0 p-6 bg-muted/30 space-y-6">

        <h1 className="text-2xl font-semibold tracking-tight">My Courses</h1>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",     value: total,     icon: BookOpen,     color: "text-indigo-500"  },
            { label: "Published", value: published, icon: CheckCircle2, color: "text-emerald-500" },
            { label: "Drafts",    value: drafts,    icon: FileText,     color: "text-yellow-500"  },
            { label: "Archived",  value: archived,  icon: Archive,      color: "text-red-400"     },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon size={15} className={color} />
              </CardHeader>
              <CardContent>
                {isLoading
                  ? <Skeleton className="h-8 w-10" />
                  : <p className="text-3xl font-bold tracking-tight">{value}</p>
                }
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Table ── */}
        {isLoading ? (
          <div className="rounded-lg border overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800 hover:bg-slate-800">
                  <TableHead className="text-slate-100 font-semibold">#</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Title</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Students</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-100 font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map(i => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-7 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-7 w-28 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium text-foreground">No courses created yet</p>
            <p className="text-sm mt-1 opacity-70">Start building your first course.</p>
            <Button
              className="mt-4 gap-2"
              onClick={() => navigate({ to: "/higherups/courses" })}
            >
              <PlusCircle size={15} />
              Create Course
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border overflow-x-auto shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800 hover:bg-slate-800">
                  <TableHead className="text-slate-100 font-semibold">#</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Title</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Students</TableHead>
                  <TableHead className="text-slate-100 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-100 font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {courses.map((course: any, index: number) => (
                  <TableRow key={course.courseId} className={ROW_STYLES[course.status]}>

                    {/* Index */}
                    <TableCell className="text-xs text-muted-foreground w-8">
                      {index + 1}
                    </TableCell>

                    {/* Title */}
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className={ICON_STYLES[course.status]} />
                        {course.title}
                      </div>
                    </TableCell>

                    {/* Students */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users size={13} />
                        {course.enrolledStudents ?? 0}
                      </div>
                    </TableCell>

                    {/* Status badge */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-semibold ${STATUS_STYLES[course.status]}`}
                      >
                        {course.status}
                      </span>
                    </TableCell>

                    {/* Manage */}
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/60 hover:bg-white"
                        onClick={() =>
                          navigate({ to: `/higherups/courses/${course.courseId}` })
                        }
                      >
                        <Eye size={14} className="mr-1" />
                        Manage
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

      </main>
    </div>
  )
}