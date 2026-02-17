/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { useState } from "react"

import { AdminSidebar } from "@/components/AdminSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react"

import { createInstructor } from "@/lib/admin"

export const Route = createFileRoute("/admin/instructor/")({
  component: InstructorsPage,
})

/* ── Validation Schema ── */
const schema = z.object({
  name:        z.string().min(2, "Name required"),
  email:       z.string().email("Invalid email"),
  password:    z.string().min(6, "Minimum 6 characters"),
  contactNo:   z.string().optional(),
  address:     z.string().optional(),
  salary:      z.string().optional(),
  designation: z.string().optional(),
})

type FormData = z.infer<typeof schema>

/* ── Reusable field error ── */
function FieldError({ form, name }: any) {
  const error = form.formState.errors[name]
  if (!error) return null
  return <p className="text-xs text-destructive">{error.message}</p>
}

function InstructorsPage() {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", email: "", password: "",
      contactNo: "", address: "", salary: "", designation: "",
    },
  })

  const mutation = useMutation({
    mutationFn: createInstructor,
    onSuccess: () => form.reset(),
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      ...data,
      salary: data.salary ? Number(data.salary) : null,
    })
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Instructor Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage instructor accounts.
            </p>
          </div>
        </div>

        {/* ── Alerts ── */}
        {mutation.isSuccess && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertTitle>Instructor created!</AlertTitle>
            <AlertDescription>
              The new instructor account has been set up successfully.
            </AlertDescription>
          </Alert>
        )}

        {mutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              Failed to create instructor. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* ── Form Card ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create Instructor</CardTitle>
                <CardDescription className="mt-1">
                  Fill in the details below to create a new instructor account.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1.5">
                <UserPlus size={13} />
                New Account
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >

              {/* ── Section: Login Info ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-foreground">Login Info</p>
                  <Separator className="flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Name */}
                  <div className="space-y-2">
                    <Label>
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Full name"
                      {...form.register("name")}
                    />
                    <FieldError form={form} name="name" />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label>
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="email@example.com"
                      {...form.register("email")}
                    />
                    <FieldError form={form} name="email" />
                  </div>

                  {/* Password */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label>
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        className="pr-10"
                        {...form.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <FieldError form={form} name="password" />
                  </div>

                </div>
              </div>

              {/* ── Section: Profile Info ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-foreground">Profile Info</p>
                  <Separator className="flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label>Contact No</Label>
                    <Input
                      placeholder="Phone number"
                      {...form.register("contactNo")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input
                      placeholder="e.g. Senior Lecturer"
                      {...form.register("designation")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Salary</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 5000"
                      {...form.register("salary")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      placeholder="City, Country"
                      {...form.register("address")}
                    />
                  </div>

                </div>
              </div>

              <Separator />

              {/* ── Submit ── */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="gap-2 min-w-36"
                >
                  <UserPlus size={15} />
                  {mutation.isPending ? "Creating..." : "Create Instructor"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}