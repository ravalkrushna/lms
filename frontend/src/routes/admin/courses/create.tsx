import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"

import { AdminSidebar } from "@/components/AdminSidebar"
import { createCourse } from "@/lib/admin"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute("/admin/courses/create")({
  component: CreateCoursePage,
})

const schema = z.object({
  title: z.string().min(3, "Title too short"),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function CreateCoursePage() {
  const navigate = useNavigate()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      navigate({ to: "/admin/courses" })
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

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
                  Description (Optional)
                </label>

                <Textarea
                  {...form.register("description")}
                  placeholder="Enter course description"
                />
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
                  onClick={() => navigate({ to: "/admin/courses" })}
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
