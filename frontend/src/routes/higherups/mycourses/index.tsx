/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { getInstructorCourses } from "@/lib/instructor"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import {
  BookOpen,
  CheckCircle2,
  FileText,
  Archive,
  Users,
  PlusCircle,
} from "lucide-react"

export const Route = createFileRoute("/higherups/mycourses/")({
  component: InstructorMyCoursesPage,
})

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

      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">My Courses</h1>
        </div>

        <div className="flex flex-col gap-6">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total",     value: total,     icon: BookOpen },
              { label: "Published", value: published, icon: CheckCircle2 },
              { label: "Drafts",    value: drafts,    icon: FileText },
              { label: "Archived",  value: archived,  icon: Archive },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                  </CardTitle>
                  <Icon size={15} className="text-primary" />
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

          {/* Loading */}
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-9 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && courses.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <BookOpen size={40} className="mb-3 opacity-20" />
                <p className="font-medium text-foreground">No courses created yet</p>
                <p className="text-sm mt-1 opacity-70">
                  Start building your first course.
                </p>
                <Button
                  className="mt-4 gap-2"
                  onClick={() => navigate({ to: "/higherups/courses" })}
                >
                  <PlusCircle size={15} />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Courses */}
          {!isLoading && courses.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course: any) => {
                const status = course.status

                return (
                  <Card key={course.courseId} className="flex flex-col hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{course.title}</CardTitle>

                        {status === "PUBLISHED" && (
                          <Badge className="text-xs text-emerald-600 bg-emerald-50 border-emerald-200">
                            Published
                          </Badge>
                        )}

                        {status === "DRAFT" && (
                          <Badge variant="secondary" className="text-xs">
                            Draft
                          </Badge>
                        )}

                        {status === "ARCHIVED" && (
                          <Badge variant="outline" className="text-xs">
                            Archived
                          </Badge>
                        )}
                      </div>

                      <CardDescription className="flex items-center gap-1.5">
                        <Users size={13} />
                        {course.enrolledStudents ?? 0} Students
                      </CardDescription>
                    </CardHeader>

                    <Separator />

                    <CardFooter className="mt-auto">
                      <Button
                        className="w-full"
                        onClick={() =>
                          navigate({ to: `/higherups/courses/${course.courseId}` })
                        }
                      >
                        Manage Course
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
