import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"
import { createCourse } from "@/lib/higherups"

import { useAuth } from "@/lib/auth-context"
import { permissions } from "@/lib/permissions"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export const Route = createFileRoute("/higherups/courses/create")({
  component: HigherupsCreateCoursePage,
})

function HigherupsCreateCoursePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const canCreate = permissions.canCreateCourse(user)

  const createMutation = useMutation({
    mutationFn: createCourse,

    onSuccess: (createdCourse) => {
      const courseId = createdCourse?.courseId ?? createdCourse?.id

      if (!courseId) {
        console.error("Invalid course response:", createdCourse)
        return
      }

      queryClient.invalidateQueries({ queryKey: ["higherups-courses"] })

      navigate({
        to: "/higherups/courses/$courseId/sections",
        params: { courseId: String(courseId) },
      })
    }


  })

  if (!user || !canCreate) return null

  function handleCreate() {
    if (!title.trim()) return

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
    })
  }

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-lg space-y-4">
          <h1 className="text-2xl font-bold">Create Course</h1>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={!title.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </main>
    </div>
  )
}
