import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"

import { AdminSidebar } from "@/components/AdminSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Users,
  Search,
  Filter,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  RefreshCw,
} from "lucide-react"

import { getAllUsers, type AdminUser } from "@/lib/admin"

export const Route = createFileRoute("/admin/students/")({
  component: AdminStudents,
})

/* ── Role config ── */
const ROLE_CONFIG: Record<
  AdminUser["role"],
  { label: string; className: string; icon: React.ReactNode }
> = {
  STUDENT: {
    label: "Student",
    className: "bg-sky-500/10 text-sky-600 border-sky-200",
    icon: <GraduationCap size={11} />,
  },
  INSTRUCTOR: {
    label: "Instructor",
    className: "bg-violet-500/10 text-violet-600 border-violet-200",
    icon: <BookOpen size={11} />,
  },
  ADMIN: {
    label: "Admin",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: <ShieldCheck size={11} />,
  },
}

/* ── Stat Card ── */
function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string
  value: number
  icon: React.ReactNode
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

/* ── Avatar with initials ── */
function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

/* ── Role Badge ── */
function RoleBadge({ role }: { role: AdminUser["role"] }) {
  const config = ROLE_CONFIG[role]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  )
}

/* ── Skeleton rows ── */
function TableSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

/* ── Main Page ── */
function AdminStudents() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<Set<AdminUser["role"]>>(
    new Set(["STUDENT", "INSTRUCTOR", "ADMIN"])
  )

  const { data: users, isLoading, refetch, isFetching } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
    refetchOnWindowFocus: false,
  })

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    if (!users) return { total: 0, students: 0, instructors: 0, admins: 0 }
    return {
      total: users.length,
      students: users.filter((u) => u.role === "STUDENT").length,
      instructors: users.filter((u) => u.role === "INSTRUCTOR").length,
      admins: users.filter((u) => u.role === "ADMIN").length,
    }
  }, [users])

  /* ── Filtered + searched users ── */
  const filtered = useMemo(() => {
    if (!users) return []
    return users.filter((u) => {
      const matchesRole = roleFilter.has(u.role)
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      return matchesRole && matchesSearch
    })
  }, [users, search, roleFilter])

  /* ── Toggle role filter ── */
  function toggleRole(role: AdminUser["role"]) {
    setRoleFilter((prev) => {
      const next = new Set(prev)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(role) ? next.delete(role) : next.add(role)
      return next
    })
  }

  const activeFilters = roleFilter.size < 3

  return (
    <TooltipProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 p-6 bg-muted/30 space-y-6">

          {/* ── Page Header ── */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Student Management
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                View and manage all registered users on the platform.
              </p>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw
                    size={15}
                    className={isFetching ? "animate-spin" : ""}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh users</TooltipContent>
            </Tooltip>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={stats.total}
              icon={<Users size={18} />}
              description="All registered accounts"
            />
            <StatCard
              title="Students"
              value={stats.students}
              icon={<GraduationCap size={18} />}
              description="Enrolled learners"
            />
            <StatCard
              title="Instructors"
              value={stats.instructors}
              icon={<BookOpen size={18} />}
              description="Course creators"
            />
            <StatCard
              title="Admins"
              value={stats.admins}
              icon={<ShieldCheck size={18} />}
              description="Platform admins"
            />
          </div>

          {/* ── Table Card ── */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription className="mt-1">
                    {isLoading
                      ? "Loading..."
                      : `Showing ${filtered.length} of ${stats.total} users`}
                  </CardDescription>
                </div>

                {/* ── Search + Filter ── */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Search name or email..."
                      className="pl-8 w-56 h-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Role filter dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 h-9"
                      >
                        <Filter size={14} />
                        Role
                        {activeFilters && (
                          <Badge className="ml-1 h-4 px-1.5 text-[10px]">
                            {roleFilter.size}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(["STUDENT", "INSTRUCTOR", "ADMIN"] as AdminUser["role"][]).map(
                        (role) => (
                          <DropdownMenuCheckboxItem
                            key={role}
                            checked={roleFilter.has(role)}
                            onCheckedChange={() => toggleRole(role)}
                          >
                            {ROLE_CONFIG[role].label}
                          </DropdownMenuCheckboxItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <div className="rounded-b-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="pl-6">User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="pr-6 text-right">ID</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {/* Loading skeletons */}
                    {isLoading && <TableSkeleton />}

                    {/* Empty / no results */}
                    {!isLoading && filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
                            <Users size={36} className="mb-3 opacity-20" />
                            <p className="font-medium">No users found</p>
                            <p className="text-sm mt-1 opacity-70">
                              Try adjusting your search or filters.
                            </p>
                            {(search || activeFilters) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-3"
                                onClick={() => {
                                  setSearch("")
                                  setRoleFilter(
                                    new Set(["STUDENT", "INSTRUCTOR", "ADMIN"])
                                  )
                                }}
                              >
                                Clear filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {/* User rows */}
                    {!isLoading &&
                      filtered.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="pl-6">
                            <div className="flex items-center gap-3">
                              <UserAvatar name={user.name} />
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>

                          <TableCell className="text-muted-foreground">
                            {user.email}
                          </TableCell>

                          <TableCell>
                            <RoleBadge role={user.role} />
                          </TableCell>

                          <TableCell className="pr-6 text-right">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs text-muted-foreground font-mono cursor-default">
                                  #{user.id}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>User ID: {user.id}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        </main>
      </div>
    </TooltipProvider>
  )
}