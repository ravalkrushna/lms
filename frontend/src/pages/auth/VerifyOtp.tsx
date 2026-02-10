// src/pages/auth/VerifyOtp.tsx
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"

import { verifyOtp } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

type OtpForm = {
  otp: string
}

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const email: string | undefined = location.state?.email

  // ✅ hooks MUST come first
  const form = useForm<OtpForm>({
    defaultValues: { otp: "" }
  })

  const verifyMutation = useMutation({
    mutationFn: (data: OtpForm) => {
      // this will never run if email is undefined
      return verifyOtp({ email: email!, otp: data.otp })
    },
    onSuccess: () => {
      navigate("/login", {
        state: { message: "Account verified. Please login." }
      })
    }
  })

  // ✅ guards AFTER hooks
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
              OTP sent to <span className="font-medium">{email}</span>
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
              {verifyMutation.isPending ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
