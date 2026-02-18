/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"
import { useAuth } from "@/lib/auth-context"

import {
  getAdminProfile,
  getInstructorProfile,
} from "@/lib/higherups"   // adjust if instructor API is elsewhere

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  Activity,
  Phone,
  MapPin,
  Briefcase,
  IndianRupee,
  Lightbulb,
  Star,
} from "lucide-react"

export const Route = createFileRoute("/higherups/profile")({
  component: HigherupsProfilePage,
})

const PROFILE_TIPS = [
  { icon: User, text: "Keep your personal details updated." },
  { icon: ShieldCheck, text: "Your role defines your platform access." },
  { icon: Activity, text: "Account status reflects system permissions." },
]

function HigherupsProfilePage() {
  const { user } = useAuth()

  const { data: profile, isLoading } = useQuery({
    queryKey: ["higherups-profile", user?.role],
    queryFn: () => {
      if (user?.role === "ADMIN") return getAdminProfile()
      return getInstructorProfile()
    },
    enabled: !!user,
  })

  const initials = profile?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "U"

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30 flex flex-col gap-4">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Your account information and details.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 flex-1">

          {/* LEFT CARD */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40" />
                </>
              ) : (
                <>
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">{profile?.name}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>

                  <div className="flex gap-1.5 flex-wrap justify-center">
                    <Badge variant="secondary" className="text-xs">
                      <Star size={11} /> {profile?.role}
                    </Badge>

                    <Badge variant="secondary" className="text-xs text-emerald-600 bg-emerald-50 border-emerald-200">
                      <Activity size={11} /> Active
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>

            <Separator />

            <CardContent className="py-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Account Status
              </p>

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs text-sky-600 bg-sky-50 border-sky-200">
                  <Lock size={11} /> Secured
                </Badge>

                <Badge variant="secondary" className="text-xs text-violet-600 bg-violet-50 border-violet-200">
                  <ShieldCheck size={11} /> Full Access
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT CARD */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Account Details</CardTitle>
              <CardDescription>
                Complete information associated with your account.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-0 flex flex-col flex-1">

              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <Table>
                  <TableBody>

                    <Row icon={User} label="Full Name" value={profile?.name} />

                    <Row icon={Mail} label="Email" value={profile?.email} />

                    <Row icon={Phone} label="Contact" value={profile?.contactNo} />

                    <Row icon={Briefcase} label="Designation" value={profile?.designation} />

                    <Row icon={IndianRupee} label="Salary" value={profile?.salary} />

                    <Row icon={MapPin} label="Address" value={profile?.address} />

                  </TableBody>
                </Table>
              )}

              {/* Tips */}
              <div className="mt-4">
                <Separator className="mb-4" />

                <div className="rounded-lg bg-muted/50 border p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Lightbulb size={12} /> Tips
                  </p>

                  {PROFILE_TIPS.map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Icon size={14} className="text-primary mt-0.5 shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}

/* ✅ Small reusable row component */
function Row({ icon: Icon, label, value }: any) {
  return (
    <TableRow>
      <TableCell className="text-muted-foreground py-4">
        <span className="flex items-center gap-2 text-sm">
          <Icon size={13} /> {label}
        </span>
      </TableCell>
      <TableCell className="font-medium text-sm">
        {value ?? "—"}
      </TableCell>
    </TableRow>
  )
}
