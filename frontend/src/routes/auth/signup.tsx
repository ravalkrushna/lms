import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { SignupSchema, type SignupInput } from "@/schemas/auth.schema"
import { signupAction } from "@/lib/auth"

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
})



function SignupPage() {
  
  const navigate = useNavigate()

  const form = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  })

  const signupMutation = useMutation({
    mutationFn: signupAction,
  })

  const onSubmit = (values: SignupInput) => {
  signupMutation.mutate(values, {
    onSuccess: () => {
      navigate({
        to: "/auth/verifyotp",
        search: { email: values.email }, 
      })
    },
  })
}


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField label="Name" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} />
            </FormField>

            <FormField label="Email" error={form.formState.errors.email?.message}>
              <Input {...form.register("email")} />
            </FormField>

            <FormField label="Password" error={form.formState.errors.password?.message}>
              <Input type="password" {...form.register("password")} />
            </FormField>

            <FormField label="Contact No" error={form.formState.errors.contactNo?.message}>
              <Input {...form.register("contactNo")} />
            </FormField>

            <FormField label="Address" error={form.formState.errors.address?.message}>
              <Input {...form.register("address")} />
            </FormField>

            <Button
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating account..." : "Signup"}
            </Button>

            {signupMutation.error && (
              <p className="text-sm text-destructive">
                {(signupMutation.error as Error).message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

/** Reusable Field Component (Clean UI Trick 🔥) */
function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
