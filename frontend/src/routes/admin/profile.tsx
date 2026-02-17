import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AdminSidebar } from "@/components/AdminSidebar"
import { getAdminProfile } from "@/lib/admin"

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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  User,
  Mail,
  ShieldCheck,
  BookOpen,
  Users,
  GraduationCap,
  Lightbulb,
  Star,
  Lock,
  Activity,
} from "lucide-react"

import { getAllCourses, getAllUsers } from "@/lib/admin"

export const Route = createFileRoute("/admin/profile")({
  component: AdminProfilePage,
})

const PLATFORM_TIPS = [
  { icon: BookOpen,    text: "Manage courses from the Courses tab to keep content up to date." },
  { icon: Users,       text: "Monitor student activity and instructor performance regularly."   },
  { icon: Lightbulb,   text: "Use the dashboard to track platform health at a glance."         },
]

function AdminProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfile,
  })

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: getAllCourses,
  })

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  })

  const statsLoading = coursesLoading || usersLoading

  const initials = profile?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "AD"

  const platformStats = [
    {
      label: "Total Courses",
      value: courses?.length ?? 0,
      icon: BookOpen,
      color: "text-sky-600",
      bg:    "bg-sky-50 border-sky-200",
    },
    {
      label: "Students",
      value: users?.filter(u => u.role === "STUDENT").length ?? 0,
      icon: GraduationCap,
      color: "text-violet-600",
      bg:    "bg-violet-50 border-violet-200",
    },
    {
      label: "Instructors",
      value: users?.filter(u => u.role === "INSTRUCTOR").length ?? 0,
      icon: Users,
      color: "text-emerald-600",
      bg:    "bg-emerald-50 border-emerald-200",
    },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 bg-muted/30 flex flex-col gap-4">

        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your account details and platform overview.
          </p>
        </div>

        {/* ── 2 col grid ── */}
        <div className="grid gap-4 lg:grid-cols-3 flex-1">

          {/* ══ LEFT: Identity card ══ */}
          <Card className="lg:col-span-1 flex flex-col">

            {/* Avatar + name */}
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
                    <p className="font-semibold">{profile?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{profile?.email ?? "—"}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    <Badge variant="secondary" className="gap-1 text-xs text-emerald-600 bg-emerald-50 border-emerald-200">
                      <ShieldCheck size={11} /> Verified
                    </Badge>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Star size={11} /> {profile?.role ?? "ADMIN"}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>

            <Separator />

            {/* Platform stat mini cards */}
            <CardContent className="py-4 space-y-2.5 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Platform Stats
              </p>
              {statsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : (
                platformStats.map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${bg}`}>
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={color} />
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                  </div>
                ))
              )}
            </CardContent>

            <Separator />

            {/* Account status */}
            <CardContent className="py-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Account Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="gap-1 text-xs text-emerald-600 bg-emerald-50 border-emerald-200">
                  <Activity size={11} /> Active
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs text-sky-600 bg-sky-50 border-sky-200">
                  <Lock size={11} /> Secured
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs text-violet-600 bg-violet-50 border-violet-200">
                  <ShieldCheck size={11} /> Full Access
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ══ RIGHT: Profile table + tips ══ */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account Details</CardTitle>
              <CardDescription className="mt-0.5">
                Your administrator account information.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-0 flex flex-col flex-1">

              {/* Profile table */}
              {isLoading ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-36">Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3].map(i => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-36">Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-muted-foreground py-4">
                        <span className="flex items-center gap-2 text-sm">
                          <User size={13} /> Full Name
                        </span>
                      </TableCell>
                      <TableCell className="font-medium py-4 text-sm">
                        {profile?.name ?? "—"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground py-4">
                        <span className="flex items-center gap-2 text-sm">
                          <Mail size={13} /> Email
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-sm">
                        <span className="text-primary font-medium">
                          {profile?.email ?? "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground py-4">
                        <span className="flex items-center gap-2 text-sm">
                          <ShieldCheck size={13} /> Role
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="gap-1 text-emerald-600 bg-emerald-50 border-emerald-200">
                          <ShieldCheck size={11} />
                          {profile?.role ?? "ADMIN"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground py-4">
                        <span className="flex items-center gap-2 text-sm">
                          <Lock size={13} /> Password
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-sm text-muted-foreground">
                        ••••••••
                        <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 h-4">
                          hidden
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground py-4">
                        <span className="flex items-center gap-2 text-sm">
                          <Activity size={13} /> Status
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="gap-1 text-emerald-600 bg-emerald-50 border-emerald-200">
                          <Activity size={11} /> Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}

              {/* Tips fill remaining space */}
              <div className="mt-4 flex-1 flex flex-col justify-end">
                <Separator className="mb-4" />
                <div className="rounded-lg bg-muted/50 border p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Lightbulb size={12} /> Admin Tips
                  </p>
                  {PLATFORM_TIPS.map(({ icon: Icon, text }, i) => (
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