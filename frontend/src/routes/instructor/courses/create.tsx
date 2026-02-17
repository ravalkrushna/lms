import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { InstructorSidebar } from "@/components/InstructorSidebar"
import { createCourse } from "@/lib/instructor"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateCourseSchema, type CreateCourseInput } from "@/schemas/instructor.schema"

import { BookOpen, AlertCircle, ArrowLeft } from "lucide-react"

/* ── Route ── */
export const Route = createFileRoute("/instructor/courses/create")({
  component: CreateCoursePage,
})

/* ── Field error ── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-destructive">{message}</p>
}

function CreateCoursePage() {
  const navigate = useNavigate()

  const form = useForm<CreateCourseInput>({
    resolver: zodResolver(CreateCourseSchema),
  })

  const mutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => navigate({ to: "/instructor/courses" }),
  })

  const onSubmit = (data: CreateCourseInput) => mutation.mutate(data)

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Course</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details to publish a new course.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate({ to: "/instructor/courses" })}
          >
            <ArrowLeft size={14} />
            Back to Courses
          </Button>
        </div>

        {/* ── Error Alert ── */}
        {mutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to create course</AlertTitle>
            <AlertDescription>
              Something went wrong. Please check your details and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* ── Form Card ── */}
        <Card className="max-w-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Course Details</CardTitle>
                <CardDescription className="mt-1">
                  Add a title and description for your course.
                </CardDescription>
              </div>
              <BookOpen size={18} className="text-muted-foreground" />
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Title */}
              <div className="space-y-2">
                <Label>
                  Course Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...form.register("title")}
                  placeholder="e.g. Introduction to React"
                />
                <FieldError message={form.formState.errors.title?.message} />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  {...form.register("description")}
                  placeholder="What will students learn in this course?"
                  className="resize-none min-h-28"
                />
                <FieldError message={form.formState.errors.description?.message} />
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/instructor/courses" })}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="gap-2 min-w-32"
                >
                  <BookOpen size={14} />
                  {mutation.isPending ? "Creating..." : "Create Course"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}