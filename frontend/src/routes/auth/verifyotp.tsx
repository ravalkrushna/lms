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
  VerifyOtpSchema,
  type VerifyOtpInput,
} from "@/schemas/auth.schema"

import { verifyOtpAction } from "@/lib/auth"

export const Route = createFileRoute("/auth/verifyotp")({
  component: VerifyOtpPage,
})

function VerifyOtpPage() {
  const navigate = useNavigate()

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(VerifyOtpSchema),
  })

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpAction,
  })

  const onSubmit = (values: VerifyOtpInput) => {
    verifyOtpMutation.mutate(values, {
      onSuccess: () => {
        navigate({ to: "/auth/login" })
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
              "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
            backgroundPosition: "center 65%", // 🔥 Perfect balance
          }}
        />

        {/* Premium overlay */}
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
            
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Verify OTP
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  label="Email"
                  error={form.formState.errors.email?.message}
                >
                  <Input {...form.register("email")} />
                </FormField>

                <FormField
                  label="OTP"
                  error={form.formState.errors.otp?.message}
                >
                  <Input {...form.register("otp")} />
                </FormField>

                <Button
                  className="w-full"
                  disabled={verifyOtpMutation.isPending}
                >
                  {verifyOtpMutation.isPending
                    ? "Verifying..."
                    : "Verify OTP"}
                </Button>

                {verifyOtpMutation.error && (
                  <p className="text-sm text-destructive text-center">
                    {(verifyOtpMutation.error as Error).message}
                  </p>
                )}
              </form>
            </CardContent>

          </Card>
        </motion.div>
      </div>
    </>
  )
}

/** ✅ Reusable Field */
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
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
