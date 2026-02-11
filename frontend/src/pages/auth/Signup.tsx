import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import { signup } from "@/api/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type SignupForm = {
  email: string
  password: string
}

export default function SignupPage() {
  const navigate = useNavigate()

  const form = useForm<SignupForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (_, variables) => {
      navigate({
        to: "/verify-otp",
        search: {
          email: variables.email,
        },
      })
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(data =>
              signupMutation.mutate(data)
            )}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...form.register("email", { required: true })}
              />
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                {...form.register("password", { required: true })}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Sending OTP..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
