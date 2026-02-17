/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { createInstructor } from "@/lib/admin"

export const Route = createFileRoute("/admin/instructor/")({
  component: InstructorsPage,
})

/* ✅ Validation Schema */
const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  contactNo: z.string().optional(),
  address: z.string().optional(),
  salary: z.string().optional(),
  designation: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function InstructorsPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const mutation = useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      form.reset()
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      ...data,
      salary: data.salary ? Number(data.salary) : null,
    })
  }

  return (
    <div className="p-6 space-y-6">

      {/* ✅ Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Instructor Management 👨‍🏫
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage instructors
        </p>
      </div>

      {/* ✅ Create Instructor Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create Instructor</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >

            {/* Name */}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
              <Error form={form} name="name" />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...form.register("email")} />
              <Error form={form} name="email" />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                {...form.register("password")}
              />
              <Error form={form} name="password" />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label>Contact No</Label>
              <Input {...form.register("contactNo")} />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Address</Label>
              <Input {...form.register("address")} />
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label>Salary</Label>
              <Input type="number" {...form.register("salary")} />
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input {...form.register("designation")} />
            </div>

            {/* Submit */}
            <div className="col-span-2 flex justify-end pt-2">
              <Button
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create Instructor"}
              </Button>
            </div>

          </form>

          {/* API Error */}
          {mutation.isError && (
            <p className="text-sm text-red-500 mt-3">
              Failed to create instructor
            </p>
          )}

          {/* Success */}
          {mutation.isSuccess && (
            <p className="text-sm text-green-500 mt-3">
              Instructor created successfully
            </p>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

/* ✅ Reusable Error Component */
function Error({ form, name }: any) {
  const error = form.formState.errors[name]
  if (!error) return null

  return (
    <p className="text-xs text-red-500">
      {error.message}
    </p>
  )
}
