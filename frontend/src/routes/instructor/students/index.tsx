import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { InstructorSidebar } from "@/components/InstructorSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  getInstructorUsers,   // ✅ CORRECT API
  type InstructorUser,
} from "@/lib/instructor"

/* ---------------- ROUTE ---------------- */

export const Route = createFileRoute("/instructor/students/")({
  component: InstructorStudents,
})

function InstructorStudents() {

  const { data: users, isLoading } = useQuery<InstructorUser[]>({
    queryKey: ["instructor-users"],
    queryFn: getInstructorUsers,
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex min-h-screen">

      <InstructorSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>User's Overview 👥</CardTitle>
          </CardHeader>

          <CardContent>

            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading users...
              </p>
            )}

            {!isLoading && (!users || users.length === 0) && (
              <EmptyState />
            )}

            {!isLoading && users && (
              <div className="rounded-md border bg-background">

                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Role</th>
                    </tr>
                  </thead>

                  <tbody>

                    {users.map(user => (
                      <tr
                        key={user.id}
                        className="border-b last:border-none hover:bg-muted/40"
                      >
                        <td className="p-3 font-medium">
                          {user.name}
                        </td>

                        <td className="p-3 text-muted-foreground">
                          {user.email}
                        </td>

                        <td className="p-3">
                          <RoleBadge role={user.role} />
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>

              </div>
            )}

          </CardContent>
        </Card>

      </main>
    </div>
  )
}

/* ---------------- ROLE BADGE ---------------- */

function RoleBadge({ role }: { role: InstructorUser["role"] }) {

  const styles = {
    STUDENT: "bg-sky-500/10 text-sky-600",
    INSTRUCTOR: "bg-violet-500/10 text-violet-600",
    ADMIN: "bg-emerald-500/10 text-emerald-600",
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
      {role}
    </span>
  )
}

/* ---------------- EMPTY STATE ---------------- */

function EmptyState() {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <div>No users found</div>
    </div>
  )
}
