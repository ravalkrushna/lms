import { Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"

import { login } from "@/api/auth"
import { loginSchema, type LoginFormValues } from "@/schema/loginSchema"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Login() {
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (user) => {
      switch (user.role) {
        case "ADMIN":
          navigate({ to: "/dashboard/admin" })
          break

        case "INSTRUCTOR":
          navigate({ to: "/dashboard/instructor" })
          break

        default:
          navigate({ to: "/dashboard/student" })
      }
    }
    ,

    onError: () => {
      form.setError("root", {
        message: "Invalid email or password",
      })
    },
  })

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(data =>
              loginMutation.mutate(data)
            )}
            className="space-y-4"
          >
            <div>
              <Label>Email</Label>
              <Input {...form.register("email")} />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                {...form.register("password")}
              />
            </div>

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? "Logging in..."
                : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          <span>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline"
            >
              Register
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
