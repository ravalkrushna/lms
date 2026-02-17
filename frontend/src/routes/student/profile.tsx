/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AppShell } from "@/components/AppShell"
import { getStudentProfile, getMyCourses } from "@/lib/student"

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
  Phone,
  MapPin,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Activity,
  Lightbulb,
  Star,
  TrendingUp,
} from "lucide-react"

export const Route = createFileRoute("/student/profile")({
  component: StudentProfile,
})

const TIPS = [
  { icon: BookOpen,   text: "Enroll in new courses from the Courses tab to keep learning."      },
  { icon: Star,       text: "Complete lessons consistently to track your progress effectively."  },
  { icon: TrendingUp, text: "Finished courses show up in your My Courses tab automatically."    },
]

function StudentProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["student-profile"],
    queryFn: getStudentProfile,
  })

  const { data: myCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ["student-enrolled-courses"],
    queryFn: getMyCourses,
  })

  const initials = profile?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "ST"

  const totalEnrolled  = myCourses?.length ?? 0
  const completed      = myCourses?.filter((c: any) => c.completed).length ?? 0
  const inProgress     = totalEnrolled - completed

  const PROFILE_ROWS = [
    { label: "Full Name",   icon: User,  value: profile?.name,      },
    { label: "Email",       icon: Mail,  value: profile?.email,     },
    { label: "Contact No",  icon: Phone, value: profile?.contactNo, },
    { label: "Address",     icon: MapPin,value: profile?.address,   },
  ]

  return (
    <AppShell title="My Profile">
      <div className="flex flex-col gap-4 h-full">

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
                      <GraduationCap size={11} /> Student
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>

            <Separator />

            {/* Course stats */}
            <CardContent className="py-4 space-y-2.5 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Learning Stats
              </p>
              {coursesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                </div>
              ) : (
                [
                  { label: "Enrolled",    value: totalEnrolled, icon: BookOpen,     color: "text-sky-600",    bg: "bg-sky-50 border-sky-200"     },
                  { label: "In Progress", value: inProgress,    icon: Activity,     color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
                  { label: "Completed",   value: completed,     icon: CheckCircle2, color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
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
                  <ShieldCheck size={11} /> Verified
                </Badge>
              </div>
            </CardContent>

          </Card>

          {/* ══ RIGHT: Table + tips ══ */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profile Information</CardTitle>
              <CardDescription className="mt-0.5">
                Your personal details and account information.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-0 flex flex-col flex-1">

              {/* ── Loading ── */}
              {isLoading && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-36">Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4].map(i => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* ── Profile table ── */}
              {!isLoading && profile && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-36">Field</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PROFILE_ROWS.map(({ label, icon: Icon, value }) => (
                      <TableRow key={label}>
                        <TableCell className="text-muted-foreground py-4">
                          <span className="flex items-center gap-2 text-sm">
                            <Icon size={13} /> {label}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-sm font-medium">
                          {label === "Email" ? (
                            <span className="text-primary">{value ?? "—"}</span>
                          ) : (
                            value ?? "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Role row */}
                    <TableRow>
                      <TableCell className="text-muted-foreground py-4">
                        <span className="flex items-center gap-2 text-sm">
                          <GraduationCap size={13} /> Role
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="gap-1 text-sky-600 bg-sky-50 border-sky-200">
                          <GraduationCap size={11} /> Student
                        </Badge>
                      </TableCell>
                    </TableRow>

                    {/* Enrolled courses row */}
                    <TableRow>
                      <TableCell className="text-muted-foreground py-4">
                        <span className="flex items-center gap-2 text-sm">
                          <BookOpen size={13} /> Enrolled Courses
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {coursesLoading ? (
                          <Skeleton className="h-4 w-8" />
                        ) : (
                          <Badge variant="secondary" className="gap-1 text-violet-600 bg-violet-50 border-violet-200">
                            <BookOpen size={11} /> {totalEnrolled} courses
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}

              {/* ── Tips fill remaining space ── */}
              <div className="mt-4 flex-1 flex flex-col justify-end">
                <Separator className="mb-4" />
                <div className="rounded-lg bg-muted/50 border p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Lightbulb size={12} /> Learning Tips
                  </p>
                  {TIPS.map(({ icon: Icon, text }, i) => (
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
      </div>
    </AppShell>
  )
}