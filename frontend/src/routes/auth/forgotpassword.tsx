import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"

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
  ForgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/schemas/auth.schema"

import { forgotPasswordAction } from "@/lib/auth"

export const Route = createFileRoute("/auth/forgotpassword")({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  const forgotMutation = useMutation({
    mutationFn: forgotPasswordAction,
  })

  const onSubmit = (values: ForgotPasswordInput) => {
    forgotMutation.mutate(values, {
      onSuccess: () => {
        navigate({
          to: "/auth/resetpassword",
          search: { email: values.email },
        })
      },
    })
  }

  return (
    <>
      {/* ✅ FULLSCREEN BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4')",
            backgroundPosition: "center 75%", // 🔥 SKY FIXED HERE
          }}
        />

        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* ✅ CONTENT */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl">
            
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl text-center font-bold">
                Forgot Password?
              </CardTitle>

              <p className="text-sm text-center text-muted-foreground">
                Enter your email to receive a reset OTP
              </p>
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

                <Button
                  className="w-full mt-2"
                  disabled={forgotMutation.isPending}
                >
                  {forgotMutation.isPending
                    ? "Sending reset OTP..."
                    : "Send OTP"}
                </Button>

                {forgotMutation.error && (
                  <p className="text-sm text-destructive text-center">
                    {(forgotMutation.error as Error).message}
                  </p>
                )}

                <p className="text-center text-sm pt-2">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/auth/login" })}
                    className="text-primary underline"
                  >
                   Login
                  </button>
                </p>
              </form>
            </CardContent>

          </Card>
        </motion.div>
      </div>
    </>
  )
}
