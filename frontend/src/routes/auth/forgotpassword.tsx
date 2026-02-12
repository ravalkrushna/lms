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

import {
  ForgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/schemas/auth.schema"

import { forgotPasswordAction } from "@/lib/auth"

export const Route = createFileRoute("/auth/forgotpassword")({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  const forgotMutation = useMutation({
    mutationFn: forgotPasswordAction,
  })

  const onSubmit = (values: ForgotPasswordInput) => {
    forgotMutation.mutate(values, {
      onSuccess: () => {
        navigate({
          to: "/auth/resetpassword", 
          search: { email: values.email },
        })
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...form.register("email")} />

              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              className="w-full"
              disabled={forgotMutation.isPending}
            >
              {forgotMutation.isPending
                ? "Sending reset OTP..."
                : "Send OTP"}
            </Button>

            {forgotMutation.error && (
              <p className="text-sm text-destructive">
                {(forgotMutation.error as Error).message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
