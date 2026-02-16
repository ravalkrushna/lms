import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"

import { InstructorSidebar } from "@/components/InstructorSidebar"
import { createCourse } from "@/lib/instructor"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateCourseSchema, type CreateCourseInput } from "@/schemas/instructor.schema"


/* ---------------- ROUTE ---------------- */

export const Route = createFileRoute("/instructor/courses/create")({
  component: CreateCoursePage,
})

function CreateCoursePage() {
  const navigate = useNavigate()

  const form = useForm<CreateCourseInput>({
    resolver: zodResolver(CreateCourseSchema),
  })

  const mutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      navigate({ to: "/instructor/courses" })
    },
  })

  const onSubmit = (data: CreateCourseInput) => {
    mutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen">

      <InstructorSidebar />

      <main className="flex-1 p-6 bg-muted/30">

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Create New Course 📚</CardTitle>
          </CardHeader>

          <CardContent>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* ✅ Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Course Title
                </label>

                <Input
                  {...form.register("title")}
                  placeholder="Enter course title"
                />

                <ErrorText message={form.formState.errors.title?.message} />
              </div>

              {/* ✅ Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description
                </label>

                <Textarea
                  {...form.register("description")}
                  placeholder="Enter course description"
                />

                <ErrorText message={form.formState.errors.description?.message} />
              </div>

              {/* ✅ Actions */}
              <div className="flex gap-2">

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Creating..." : "Create Course"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/instructor/courses" })}
                >
                  Cancel
                </Button>

              </div>

            </form>

          </CardContent>
        </Card>

      </main>
    </div>
  )
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p className="text-xs text-red-500">
      {message}
    </p>
  )
}
