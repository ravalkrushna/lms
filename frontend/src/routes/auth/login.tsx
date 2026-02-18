import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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

  const queryClient = useQueryClient()

  const onSubmit = (values: LoginInput) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {

        queryClient.invalidateQueries({ queryKey: ["auth-user"] })

        if (data.role === "STUDENT") {
          navigate({ to: "/student/dashboard" })
        } else {
          navigate({ to: "/higherups/dashboard" })
        }
      },
    })
  }


  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-cyan-900/30 via-transparent to-cyan-900/30" />
      </div>

      {/* Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl">
          <CardHeader className="space-y-1 pb-6 pt-8">
            <CardTitle className="text-3xl text-center font-bold text-gray-900"> Welcome </CardTitle>
            <p className="text-sm text-center text-gray-600">
              Sign in to your account
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="Enter your email"
                  className="h-11 bg-white/70 backdrop-blur-sm border-gray-200"
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
                  className="h-11 bg-white/70 backdrop-blur-sm border-gray-200"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 h-auto text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => navigate({ to: "/auth/forgotpassword" })}
                >
                  Forgot Password?
                </Button>
              </div>

              <Button className="w-full h-11 mt-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>

              {loginMutation.error && (
                <p className="text-sm text-destructive text-center">
                  {(loginMutation.error as Error).message}
                </p>
              )}

              <p className="text-center text-sm text-gray-700 pt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/auth/signup" })}
                  className="text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}