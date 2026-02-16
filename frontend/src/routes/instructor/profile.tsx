import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"

import { InstructorSidebar } from "@/components/InstructorSidebar"
import {
  getInstructorProfile,
  updateInstructorProfile,
} from "@/lib/instructor"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/instructor/profile")({
  component: InstructorProfilePage,
})

type FormData = {
  contactNo: string
  address: string
  designation: string
  salary?: number
}

function InstructorProfilePage() {
  const queryClient = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ["instructor-profile"],
    queryFn: getInstructorProfile,
  })

  const { register, handleSubmit, reset } = useForm<FormData>()

  useEffect(() => {
    if (!profile) return

    reset({
      contactNo: profile.contactNo ?? "",
      address: profile.address ?? "",
      designation: profile.designation ?? "",
      salary: profile.salary ? Number(profile.salary) : undefined,
    })
  }, [profile, reset])

  const mutation = useMutation({
    mutationFn: updateInstructorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-profile"] })
      setIsEditing(false)   // ✅ Switch back to view mode
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-3xl">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Instructor Profile 🎓</CardTitle>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm px-3 py-1 rounded-md border hover:bg-muted"
                >
                  Edit Details
                </button>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {isLoading && (
                <p className="text-muted-foreground">
                  Loading profile...
                </p>
              )}

              {!isLoading && profile && (
                <>
                  {/* ✅ VIEW MODE */}
                  {!isEditing && (
                    <div className="space-y-3 text-sm">
                      <ProfileRow label="Name" value={profile.name} />
                      <ProfileRow label="Email" value={profile.email} />
                      <ProfileRow label="Contact" value={profile.contactNo} />
                      <ProfileRow label="Address" value={profile.address} />
                      <ProfileRow label="Designation" value={profile.designation} />
                      <ProfileRow
                        label="Salary"
                        value={
                          profile.salary
                            ? `₹ ${profile.salary}`
                            : null
                        }
                      />
                    </div>
                  )}

                  {/* ✅ EDIT MODE */}
                  {isEditing && (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <InputField
                        label="Contact Number"
                        {...register("contactNo")}
                      />

                      <InputField
                        label="Address"
                        {...register("address")}
                      />

                      <InputField
                        label="Designation"
                        {...register("designation")}
                      />

                      <InputField
                        label="Salary"
                        type="number"
                        step="0.01"
                        {...register("salary", {
                          setValueAs: (v) =>
                            v === "" ? undefined : Number(v),
                        })}
                      />

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={mutation.isPending}
                          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                        >
                          {mutation.isPending
                            ? "Saving..."
                            : "Save Details"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 rounded-lg border hover:bg-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

/* ✅ Typed Input */
type InputFieldProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
  }

function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <input
        className="w-full border rounded-md px-3 py-2 bg-background"
        {...props}
      />
    </div>
  )
}

function ProfileRow({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  return (
    <div className="flex gap-6 border-b pb-2">
      <span className="text-muted-foreground w-32 shrink-0">
        {label}
      </span>

      <span className="font-medium">
        {value || "—"}
      </span>
    </div>
  )
}
