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
  VerifyOtpSchema,
  type VerifyOtpInput,
} from "@/schemas/auth.schema"

import { verifyOtpAction } from "@/lib/auth"

export const Route = createFileRoute("/auth/verifyotp")({
  component: VerifyOtpPage,
})

function VerifyOtpPage() {

  const navigate = useNavigate();

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(VerifyOtpSchema),
  })

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpAction,
  })

  const onSubmit = (values: VerifyOtpInput) => {
    verifyOtpMutation.mutate(values , {
       onSuccess: () => {
      navigate({
        to: "/auth/login",
      })
    },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              label="Email"
              error={form.formState.errors.email?.message}
            >
              <Input {...form.register("email")} />
            </FormField>

            <FormField
              label="OTP"
              error={form.formState.errors.otp?.message}
            >
              <Input {...form.register("otp")} />
            </FormField>

            <Button
              className="w-full"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending
                ? "Verifying..."
                : "Verify OTP"}
            </Button>

            {verifyOtpMutation.error && (
              <p className="text-sm text-destructive">
                {(verifyOtpMutation.error as Error).message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

/** Reusable Field */
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
