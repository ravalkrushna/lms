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

import { LoginSchema, type LoginInput } from "@/schemas/auth.schema"
import { loginAction } from "@/lib/auth"

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
})

function LoginPage() {

  const navigate = useNavigate()
  
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: loginAction,
  })

  const onSubmit = (values: LoginInput) => {
  loginMutation.mutate(values, {
    onSuccess: (data) => {

      const role = data.role

      if (role === "STUDENT") {
        navigate({ to: "/student/dashboard" })
      }

      if (role === "INSTRUCTOR") {
        navigate({ to: "/instructor/dashboard" })
      }

      if (role === "ADMIN") {
        navigate({ to: "/admin/dashboard" })
      }
    },
  })
}


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="Enter your email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={() => navigate({ to: "/auth/forgotpassword" })}
            >
              Forgot Password?
            </Button>


            {loginMutation.error && (
              <p className="text-sm text-destructive">
                {(loginMutation.error as Error).message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
