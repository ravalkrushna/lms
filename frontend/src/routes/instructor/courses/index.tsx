/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, useEffect } from "react"
import { z } from "zod"

import { InstructorSidebar } from "@/components/InstructorSidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  getInstructorCourses,
  publishCourse,
  unpublishCourse,
  type InstructorCourse,
} from "@/lib/instructor"

import { Search, Plus, BookOpen } from "lucide-react"

/* ---------------- SEARCH SCHEMA ---------------- */

const coursesSearchSchema = z.object({
  search: z.string().optional().catch(""),
  status: z.enum(["ALL", "DRAFT", "PUBLISHED"]).optional().catch("ALL"),
})

type CoursesSearch = z.infer<typeof coursesSearchSchema>

/* ---------------- ROUTE ---------------- */

export const Route = createFileRoute("/instructor/courses/")({
  component: InstructorCourses,
  validateSearch: coursesSearchSchema,
})

function InstructorCourses() {
  const navigate = useNavigate()

  const { search: searchQuery = "", status: activeFilter = "ALL" } =
    Route.useSearch()

  const [searchInput, setSearchInput] = useState(searchQuery)

  /* ---------------- SEARCH DEBOUNCE ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        navigate({
          to: ".",
          search: { ...Route.useSearch(), search: searchInput },
          replace: true,
        })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, searchQuery, navigate])

  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  /* ---------------- QUERY ---------------- */

  const { data: courses, isLoading } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: getInstructorCourses,
  })

  /* ---------------- FILTERING ---------------- */

  const filteredCourses = useMemo(() => {
    if (!courses) return []

    let filtered = courses

    if (activeFilter !== "ALL") {
      filtered = filtered.filter(c => c.status === activeFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()

      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(q)
      )
    }

    return filtered
  }, [courses, activeFilter, searchQuery])

  /* ---------------- STATS ---------------- */

  const stats = useMemo(() => {
    if (!courses)
      return { total: 0, published: 0, draft: 0 }

    return {
      total: courses.length,
      published: courses.filter(c => c.status === "PUBLISHED").length,
      draft: courses.filter(c => c.status === "DRAFT").length,
    }
  }, [courses])

  const updateFilter = (status: CoursesSearch["status"]) => {
    navigate({
      to: ".",
      search: { ...Route.useSearch(), status },
    })
  }

  const clearFilters = () => {
    setSearchInput("")
    navigate({
      to: ".",
      search: { search: "", status: "ALL" },
    })
  }

  const filters = [
    { label: "All", value: "ALL" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft", value: "DRAFT" },
  ] as const

  return (
    <div className="flex min-h-screen bg-white">
      <InstructorSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">My Courses</h1>
              <p className="text-sm text-gray-500">
                {stats.total} total courses
              </p>
            </div>

            <Button
              onClick={() =>
                navigate({ to: "/instructor/courses/create" })
              }
              className="bg-black hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              {filters.map(filter => (
                <Button
                  key={filter.value}
                  variant={
                    activeFilter === filter.value
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => updateFilter(filter.value)}
                >
                  {filter.label}
                  {filter.value !== "ALL" && (
                    <span className="ml-1.5 text-xs opacity-60">
                      (
                      {filter.value === "PUBLISHED"
                        ? stats.published
                        : stats.draft}
                      )
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {(searchQuery || activeFilter !== "ALL") && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <Loader />
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            hasSearch={!!searchQuery}
            hasFilter={activeFilter !== "ALL"}
            onClear={clearFilters}
          />
        ) : (
          <CoursesTable courses={filteredCourses} />
        )}
      </main>
    </div>
  )
}

/* ---------------- TABLE ---------------- */

function CoursesTable({ courses }: { courses: InstructorCourse[] }) {
  const navigate = useNavigate()

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-6 py-3 text-xs">Course</th>
            <th className="text-left px-6 py-3 text-xs">Status</th>
            <th className="text-right px-6 py-3 text-xs">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {courses.map(course => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                  </div>

                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-500">
                      ID: {course.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <StatusControl course={course} />
              </td>

              <td className="px-6 py-4 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    navigate({
                      to: "/instructor/courses/$courseId/sections",
                      params: { courseId: String(course.id) },
                    })
                  }
                >
                  Manage
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------------- STATUS ---------------- */

function StatusControl({ course }: { course: InstructorCourse }) {
  const queryClient = useQueryClient()

  const publish = useMutation({
    mutationFn: () => publishCourse(course.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] }),
  })

  const unpublish = useMutation({
    mutationFn: () => unpublishCourse(course.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] }),
  })

  const isLoading = publish.isPending || unpublish.isPending

  return (
    <select
      value={course.status}
      onChange={e => {
        const value = e.target.value

        if (value === "PUBLISHED") publish.mutate()
        if (value === "DRAFT") unpublish.mutate()
      }}
      disabled={isLoading}
      className="text-xs border rounded-full px-3 py-1.5"
    >
      <option value="DRAFT">Draft</option>
      <option value="PUBLISHED">Published</option>
    </select>
  )
}

/* ---------------- STATES ---------------- */

function Loader() {
  return (
    <div className="flex justify-center py-32">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function EmptyState({
  onClear,
}: {
  hasSearch: boolean
  hasFilter: boolean
  onClear: () => void
}) {
  return (
    <div className="text-center py-32">
      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium">No courses found</h3>
      <p className="text-sm text-gray-500 mb-4">
        Try adjusting filters
      </p>
      <Button variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  )
}
