/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"

import { InstructorSidebar } from "@/components/InstructorSidebar"
import {
  getInstructorProfile,
  updateInstructorProfile,
} from "@/lib/instructor"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  IndianRupee,
  Pencil,
  X,
  Check,
  GraduationCap,
  AlertCircle,
  ShieldCheck,
  Lightbulb,
  BookOpen,
  Star,
  TrendingUp,
} from "lucide-react"

export const Route = createFileRoute("/instructor/profile")({
  component: InstructorProfilePage,
})

type FormData = {
  contactNo: string
  address: string
  designation: string
  salary?: number
}

const PROFILE_FIELDS = [
  { key: "name",        label: "Full Name",   icon: User,        editable: false },
  { key: "email",       label: "Email",       icon: Mail,        editable: false },
  { key: "contactNo",   label: "Contact No",  icon: Phone,       editable: true  },
  { key: "address",     label: "Address",     icon: MapPin,      editable: true  },
  { key: "designation", label: "Designation", icon: Briefcase,   editable: true  },
  { key: "salary",      label: "Salary",      icon: IndianRupee, editable: true  },
] as const

/* ── Tips shown in the right card below the table ── */
const TIPS = [
  { icon: BookOpen,   text: "Keep your designation up to date so students know your expertise." },
  { icon: Star,       text: "A complete profile builds trust with your students." },
  { icon: TrendingUp, text: "Instructors with full profiles get more engagement." },
]

function InstructorProfilePage() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ["instructor-profile"],
    queryFn: getInstructorProfile,
  })

  const { register, handleSubmit, reset } = useForm<FormData>()

  useEffect(() => {
    if (!profile) return
    reset({
      contactNo:   profile.contactNo   ?? "",
      address:     profile.address     ?? "",
      designation: profile.designation ?? "",
      salary:      profile.salary ? Number(profile.salary) : undefined,
    })
  }, [profile, reset])

  const mutation = useMutation({
    mutationFn: updateInstructorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-profile"] })
      setIsEditing(false)
    },
  })

  const onSubmit = (data: FormData) => mutation.mutate(data)

  const initials = profile?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "IN"

  function displayValue(key: string, value: string | number | null | undefined) {
    if (!value) return "—"
    if (key === "salary") return `₹ ${value}`
    return String(value)
  }

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />

      <main className="flex-1 p-6 bg-muted/30 flex flex-col gap-4">

        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            View and update your instructor profile details.
          </p>
        </div>

        {/* ── Error Alert ── */}
        {mutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Update failed</AlertTitle>
            <AlertDescription>Could not save your changes. Please try again.</AlertDescription>
          </Alert>
        )}

        {/* ── Main 2-col grid ── */}
        <div className="grid gap-4 lg:grid-cols-3 flex-1">

          {/* ══ LEFT CARD ══ */}
          <Card className="lg:col-span-1 flex flex-col">

            {/* Avatar + name + badges */}
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
                  <div className="flex flex-wrap justify-center gap-1.5">
                    <Badge variant="secondary" className="gap-1 text-xs text-emerald-600 bg-emerald-50 border-emerald-200">
                      <ShieldCheck size={11} /> Verified
                    </Badge>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <GraduationCap size={11} />
                      {profile?.designation ?? "Instructor"}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>

            <Separator />

            {/* Compact contact rows */}
            <CardContent className="py-3 space-y-2.5">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
              ) : (
                [
                  { icon: Phone,       value: profile?.contactNo ?? "—" },
                  { icon: MapPin,      value: profile?.address ?? "—" },
                  { icon: IndianRupee, value: profile?.salary ? `₹ ${profile.salary}` : "—" },
                ].map(({ icon: Icon, value }, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Icon size={13} className="text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{value}</span>
                  </div>
                ))
              )}
            </CardContent>

            <Separator />

            {/* ── Profile completeness ── */}
            <CardContent className="py-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Profile Completeness
              </p>
              {isLoading ? (
                <Skeleton className="h-2 w-full rounded-full" />
              ) : (
                (() => {
                  const fields = [
                    profile?.contactNo,
                    profile?.address,
                    profile?.designation,
                    profile?.salary,
                  ]
                  const filled = fields.filter(Boolean).length
                  const pct = Math.round((filled / fields.length) * 100)
                  return (
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-primary" : "bg-orange-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {filled}/{fields.length} fields completed
                        {pct === 100 && (
                          <span className="ml-1 text-emerald-600 font-medium">· Complete! 🎉</span>
                        )}
                      </p>
                    </div>
                  )
                })()
              )}
            </CardContent>

            <Separator />

            {/* Edit button pinned at bottom */}
            <CardContent className="py-3 mt-auto">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                >
                  <Pencil size={13} />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1.5 text-muted-foreground"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={13} />
                  Cancel Editing
                </Button>
              )}
            </CardContent>
          </Card>

          {/* ══ RIGHT CARD ══ */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Profile Details</CardTitle>
                  <CardDescription className="mt-0.5">
                    {isEditing ? "Update your editable fields below." : "Your current profile information."}
                  </CardDescription>
                </div>
                {isEditing && (
                  <Badge className="gap-1.5 bg-amber-500/10 text-amber-600 border-amber-200 text-xs">
                    <Pencil size={10} /> Editing
                  </Badge>
                )}
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="flex-1 pt-0 flex flex-col">

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
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* ── View Mode ── */}
              {!isLoading && !isEditing && profile && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-36">Field</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PROFILE_FIELDS.map(({ key, label, icon: Icon }) => (
                        <TableRow key={key}>
                          <TableCell className="text-muted-foreground py-3">
                            <span className="flex items-center gap-2 text-sm">
                              <Icon size={13} /> {label}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium py-3 text-sm">
                            {key === "salary" && (profile as any)[key] ? (
                              <Badge variant="secondary" className="gap-1 text-emerald-700 bg-emerald-50 border-emerald-200">
                                <IndianRupee size={11} />{(profile as any)[key]}
                              </Badge>
                            ) : key === "email" ? (
                              <span className="text-primary">{displayValue(key, (profile as any)[key])}</span>
                            ) : (
                              displayValue(key, (profile as any)[key])
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* ── Tips section fills the gap ── */}
                  <div className="mt-4 flex-1 flex flex-col justify-end">
                    <Separator className="mb-4" />
                    <div className="rounded-lg bg-muted/50 border p-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Lightbulb size={12} /> Instructor Tips
                      </p>
                      {TIPS.map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <Icon size={14} className="text-primary mt-0.5 shrink-0" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Edit Mode ── */}
              {!isLoading && isEditing && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-1 pt-3">

                  {/* Locked rows */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-36">Field</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PROFILE_FIELDS.filter(f => !f.editable).map(({ key, label, icon: Icon }) => (
                        <TableRow key={key} className="bg-muted/30">
                          <TableCell className="text-muted-foreground py-3">
                            <span className="flex items-center gap-2 text-sm">
                              <Icon size={13} /> {label}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 text-sm text-muted-foreground font-medium">
                            {displayValue(key, (profile as any)?.[key])}
                            <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 h-4">locked</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator />

                  {/* Editable inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5 text-xs"><Phone size={12} /> Contact No</Label>
                      <Input className="h-8 text-sm" placeholder="Phone number" {...register("contactNo")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5 text-xs"><Briefcase size={12} /> Designation</Label>
                      <Input className="h-8 text-sm" placeholder="e.g. Senior Lecturer" {...register("designation")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5 text-xs"><MapPin size={12} /> Address</Label>
                      <Input className="h-8 text-sm" placeholder="City, Country" {...register("address")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5 text-xs"><IndianRupee size={12} /> Salary</Label>
                      <Input
                        className="h-8 text-sm"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 50000"
                        {...register("salary", {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                      />
                    </div>
                  </div>

                  {/* Actions pushed to bottom */}
                  <div className="flex justify-end gap-2 mt-auto">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={mutation.isPending} className="gap-1.5 min-w-28">
                      <Check size={13} />
                      {mutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}

            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}