import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"

import { verifyOtp } from "@/api/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type OtpForm = {
  otp: string
}

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const { email } = useSearch({ from: "/verify-otp" })

  const form = useForm<OtpForm>({
    defaultValues: { otp: "" },
  })

  const verifyMutation = useMutation({
    mutationFn: (data: OtpForm) =>
      verifyOtp({ email: email!, otp: data.otp }),
    onSuccess: () => {
      navigate({ to: "/login" })
    },
  })

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Card className="w-full max-w-sm">
          <CardContent className="text-center text-sm text-muted-foreground">
            Invalid access. Please sign up again.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verify email</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(data =>
              verifyMutation.mutate(data)
            )}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              OTP sent to{" "}
              <span className="font-medium">{email}</span>
            </p>

            <div className="space-y-1">
              <Label>OTP</Label>
              <Input
                placeholder="Enter OTP"
                {...form.register("otp", { required: true })}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending
                ? "Verifying..."
                : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
