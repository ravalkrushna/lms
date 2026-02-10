import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginSchema } from "../../schema/loginSchema"
import type { LoginFormValues } from "../../schema/loginSchema"

import { login, getMe } from "@/api/auth"

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

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values)

      const me = await getMe()

      if (me.role === "STUDENT") {
        navigate("/student/dashboard")
      } else if (me.role === "INSTRUCTOR") {
        navigate("/instructor/dashboard")
      } else if (me.role === "ADMIN") {
        navigate("/admin/dashboard")
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      form.setError("root", {
        message: "Invalid email or password",
      })
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
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

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Logging in..."
                : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          <span className="text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
