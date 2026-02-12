import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router"
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

import {
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "@/schemas/auth.schema"

import { resetPasswordAction } from "@/lib/auth"

export const Route = createFileRoute("/auth/resetpassword")({
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),

  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { email } = useSearch({ from: "/auth/resetpassword" })

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),

    defaultValues: {
      email,
    },
  })

  const resetMutation = useMutation({
    mutationFn: resetPasswordAction,
  })

  const onSubmit = (values: ResetPasswordInput) => {
    resetMutation.mutate(values, {
      onSuccess: () => {
        navigate({ to: "/auth/login" })
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField label="Email">
              <Input disabled {...form.register("email")} />
            </FormField>

            <FormField label="OTP" error={form.formState.errors.otp?.message}>
              <Input {...form.register("otp")} />
            </FormField>

            <FormField label="New Password" error={form.formState.errors.newPassword?.message}>
              <Input type="password" {...form.register("newPassword")} />
            </FormField>

            <FormField label="Confirm Password" error={form.formState.errors.confirmNewPassword?.message}>
              <Input type="password" {...form.register("confirmNewPassword")} />
            </FormField>

            <Button
              className="w-full"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>

            {resetMutation.error && (
              <p className="text-sm text-destructive">
                {(resetMutation.error as Error).message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

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
