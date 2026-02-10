import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { loginSchema, type LoginFormValues } from "@/schema/loginSchema"

export default function Login() {
  const navigate = useNavigate()
  const [checkingSession, setCheckingSession] = useState(true)

  // ✅ Check session BEFORE rendering login UI
  useEffect(() => {
    getMe()
      .then((me) => {
        if (me.role === "STUDENT") navigate("/student/dashboard", { replace: true })
        if (me.role === "INSTRUCTOR") navigate("/instructor/dashboard", { replace: true })
        if (me.role === "ADMIN") navigate("/admin/dashboard", { replace: true })
      })
      .catch(() => {
        // not logged in → show login form
      })
      .finally(() => setCheckingSession(false))
  }, [navigate])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values)
      const me = await getMe()

      if (me.role === "STUDENT") navigate("/student/dashboard")
      if (me.role === "INSTRUCTOR") navigate("/instructor/dashboard")
      if (me.role === "ADMIN") navigate("/admin/dashboard")
    } catch {
      form.setError("root", {
        message: "Invalid email or password",
      })
    }
  }

  // 🔑 THIS removes flicker
  if (checkingSession) {
    return null // later you can show spinner/skeleton
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...form.register("email")} />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} />
            </div>

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          <span className="text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Register
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
