import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { motion } from "framer-motion"

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
  const [touched, setTouched] = useState(false)

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
    },
  })

  if (!user || !canCreate) return null

  const isInvalid = touched && !title.trim()

  function handleCreate() {
    setTouched(true)

    if (!title.trim()) return

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
    })
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <HigherupsSidebar />

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-4xl grid md:grid-cols-2 gap-6"
        >

          {/* FORM */}
          <motion.div
            layout
            className="bg-background rounded-2xl shadow-sm border p-6 space-y-5"
          >
            <div>
              <h1 className="text-2xl font-bold">Create Course</h1>
              <p className="text-sm text-muted-foreground">
                Design your course before adding sections & lessons
              </p>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Advanced React Patterns"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setTouched(true)}
                className={isInvalid ? "border-red-500" : ""}
              />
              {isInvalid && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500"
                >
                  Course title is required
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Briefly describe what students will learn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {description.length} characters
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCreate}
                disabled={!title.trim() || createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending
                  ? "Creating Course..."
                  : "Create Course"}
              </Button>
            </motion.div>

            {createMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground text-center"
              >
                Setting up your course workspace…
              </motion.div>
            )}
          </motion.div>

          {/* LIVE PREVIEW */}
          <motion.div
            layout
            className="bg-background rounded-2xl shadow-sm border p-6 space-y-4"
          >
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Live Preview
              </h2>
              <p className="text-xs text-muted-foreground">
                This is how your course appears to students
              </p>
            </div>

            <motion.div
              layout
              className="rounded-xl border bg-muted/40 p-4 space-y-2"
            >
              <h3 className="font-semibold text-lg">
                {title || "Course Title"}
              </h3>

              <p className="text-sm text-muted-foreground">
                {description || "Course description will appear here..."}
              </p>
            </motion.div>

            <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
              <p>✔ Status defaults to Draft</p>
              <p>✔ Sections can be added next</p>
              <p>✔ Visibility controlled later</p>
            </div>

            {/* Micro interaction indicator */}
            {title && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-emerald-600"
              >
                Looks good ✨
              </motion.div>
            )}
          </motion.div>

        </motion.div>
      </main>
    </div>
  )
}