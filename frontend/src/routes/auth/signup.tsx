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
import { SignupSchema, type SignupInput } from "@/schemas/auth.schema"
import { signupAction } from "@/lib/auth"

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const form = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  })

  const signupMutation = useMutation({
    mutationFn: signupAction,
  })

  const onSubmit = (values: SignupInput) => {
    signupMutation.mutate(values, {
      onSuccess: () => {
        navigate({
          to: "/auth/verifyotp",
          search: { email: values.email },
        })
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
              "url('https://images.unsplash.com/photo-1439066615861-d1af74d74000')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/30 via-transparent to-blue-900/30" />
      </div>

      {/* Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 rounded-2xl">
          <CardHeader className="space-y-1 pb-6 pt-8">
            <CardTitle className="text-3xl text-center font-bold text-gray-900">Create Account</CardTitle>
            <p className="text-sm text-center text-gray-600">Join us today</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField label="Name" error={form.formState.errors.name?.message}>
                <Input 
                  placeholder="Enter your name" 
                  className="h-11 bg-white/70 backdrop-blur-sm border-gray-200"
                  {...form.register("name")} 
                />
              </FormField>

              <FormField label="Email" error={form.formState.errors.email?.message}>
                <Input 
                  placeholder="Enter your email" 
                  className="h-11 bg-white/70 backdrop-blur-sm border-gray-200"
                  {...form.register("email")} 
                />
              </FormField>

              <FormField label="Password" error={form.formState.errors.password?.message}>
                <Input 
                  type="password" 
                  placeholder="Enter password" 
                  className="h-11 bg-white/70 backdrop-blur-sm border-gray-200"
                  {...form.register("password")} 
                />
              </FormField>

              <FormField label="Contact No" error={form.formState.errors.contactNo?.message}>
                <Input 
                  placeholder="Enter contact number" 
                  className="h-11 bg-white/70 backdrop-blur-sm border-gray-200"
                  {...form.register("contactNo")} 
                />
              </FormField>

              <FormField label="Address" error={form.formState.errors.address?.message}>
                <Input 
                  placeholder="Enter address" 
                  className="h-11 bg-white/70 backdrop-blur-sm border-gray-200"
                  {...form.register("address")} 
                />
              </FormField>

              <Button
                className="w-full mt-6 h-11 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creating account..." : "Signup"}
              </Button>

              {signupMutation.error && (
                <p className="text-sm text-destructive text-center">
                  {(signupMutation.error as Error).message}
                </p>
              )}

              <p className="text-center text-sm text-gray-700 pt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/auth/login" })}
                  className="text-blue-600 hover:text-blue-700 underline font-medium"
                >
                   Login
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

/** Reusable Field Component */
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