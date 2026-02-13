/* eslint-disable react-hooks/rules-of-hooks */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, useEffect } from "react"
import { z } from "zod"

import { AdminSidebar } from "@/components/AdminSidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  getAllCourses,
  publishCourse,
  unpublishCourse,
  archiveCourse,
  type AdminCourse,
} from "@/lib/admin"

import {
  Search,
  Plus,
  BookOpen,
} from "lucide-react"

// ✅ Zod schema for search params validation
const coursesSearchSchema = z.object({
  search: z.string().optional().catch(""),
  status: z.enum(["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"]).optional().catch("ALL"),
})

// ✅ Type-safe search params
type CoursesSearch = z.infer<typeof coursesSearchSchema>

// ✅ Route definition with search params
export const Route = createFileRoute("/admin/courses/")({
  component: AdminCourses,
  validateSearch: coursesSearchSchema,
})

function AdminCourses() {
  const navigate = useNavigate()
  
  // ✅ Get search params from router
  const { search: searchQuery = "", status: activeFilter = "ALL" } = Route.useSearch()
  
  // ✅ Local state for input (to allow typing without lag)
  const [searchInput, setSearchInput] = useState(searchQuery)
  
  // ✅ Debounce search updates to URL
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
  
  // ✅ Sync URL changes back to input
  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: getAllCourses,
    refetchOnWindowFocus: false,
  })

  // ✅ Update filter
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

  // Filter and search logic
  const filteredCourses = useMemo(() => {
    if (!courses) return []

    let filtered = courses

    // Apply status filter
    if (activeFilter !== "ALL") {
      filtered = filtered.filter(course => course.status === activeFilter)
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [courses, activeFilter, searchQuery])

  // Statistics
  const stats = useMemo(() => {
    if (!courses) return { total: 0, published: 0, draft: 0, archived: 0 }
    
    return {
      total: courses.length,
      published: courses.filter(c => c.status === "PUBLISHED").length,
      draft: courses.filter(c => c.status === "DRAFT").length,
      archived: courses.filter(c => c.status === "ARCHIVED").length,
    }
  }, [courses])

  const filters: { label: string; value: CoursesSearch["status"] }[] = [
    { label: "All", value: "ALL" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft", value: "DRAFT" },
    { label: "Archived", value: "ARCHIVED" },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <main className="flex-1 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
              <p className="text-sm text-gray-500 mt-1">{stats.total} total courses</p>
            </div>
            <Button 
              onClick={() => navigate({ to: "/admin/courses/create" })}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-900"
              />
            </div>

            <div className="flex gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter(filter.value)}
                  className={
                    activeFilter === filter.value
                      ? "bg-gray-900 hover:bg-gray-800 text-white"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                >
                  {filter.label}
                  {filter.value !== "ALL" && (
                    <span className="ml-1.5 text-xs opacity-60">
                      ({filter.value === "PUBLISHED" ? stats.published :
                         filter.value === "DRAFT" ? stats.draft :
                         stats.archived})
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {(searchQuery || activeFilter !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-900"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Courses List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <EmptyState 
            hasSearch={!!searchQuery} 
            hasFilter={activeFilter !== "ALL"}
            onClear={clearFilters}
          />
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {course.title}
                          </p>
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
                            to: "/admin/courses/$courseId/sections",
                            params: { courseId: String(course.id) },
                          })
                        }
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

function StatusControl({ 
  course, 
}: { 
  course: AdminCourse
}) {
  const queryClient = useQueryClient()

  const publish = useMutation({
    mutationFn: () => publishCourse(course.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  })

  const unpublish = useMutation({
    mutationFn: () => unpublishCourse(course.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  })

  const archive = useMutation({
    mutationFn: () => archiveCourse(course.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  })

  const isLoading = publish.isPending || unpublish.isPending || archive.isPending

  const statusStyles = {
    PUBLISHED: "bg-green-50 text-green-700 border-green-200",
    DRAFT: "bg-yellow-50 text-yellow-700 border-yellow-200",
    ARCHIVED: "bg-gray-50 text-gray-700 border-gray-200",
  }

  return (
    <div className="relative inline-block">
      <select
        value={course.status}
        onChange={(e) => {
          const value = e.target.value

          if (value === "PUBLISHED") publish.mutate()
          if (value === "DRAFT") unpublish.mutate()
          if (value === "ARCHIVED") archive.mutate()
        }}
        disabled={isLoading}
        className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
          statusStyles[course.status as keyof typeof statusStyles]
        }`}
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>
      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

function EmptyState({ 
  hasSearch, 
  hasFilter,
  onClear 
}: { 
  hasSearch: boolean
  hasFilter: boolean
  onClear: () => void
}) {
  if (hasSearch || hasFilter) {
    return (
      <div className="text-center py-32">
        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
        <p className="text-sm text-gray-500 mb-4">
          Try adjusting your search or filters
        </p>
        <Button
          variant="outline"
          onClick={onClear}
          className="border-gray-200"
        >
          Clear filters
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center py-32">
      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No courses yet</h3>
      <p className="text-sm text-gray-500 mb-4">
        Get started by creating your first course
      </p>
      <Button className="bg-gray-900 hover:bg-gray-800">
        <Plus className="w-4 h-4 mr-2" />
        Create Course
      </Button>
    </div>
  )
}