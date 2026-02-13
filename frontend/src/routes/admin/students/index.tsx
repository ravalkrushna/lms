import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { AdminSidebar } from "@/components/AdminSidebar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  getAllUsers,
  promoteInstructor,
  type AdminUser,
} from "@/lib/admin"

export const Route = createFileRoute("/admin/students/")({
  component: AdminStudents,
})

function AdminStudents() {

  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
    refetchOnWindowFocus: false,
  })

  const promoteMutation = useMutation({
    mutationFn: (email: string) => promoteInstructor(email),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      }),
  })

  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Students Management 👥</CardTitle>
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
                          <div className="flex items-center gap-2">

                            <RoleBadge role={user.role} />

                            {user.role === "STUDENT" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  promoteMutation.mutate(user.email)
                                }
                                disabled={promoteMutation.isPending}
                              >
                                {promoteMutation.isPending
                                  ? "Promoting..."
                                  : "Promote 🚀"}
                              </Button>
                            )}

                          </div>
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

function RoleBadge({ role }: { role: AdminUser["role"] }) {

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

function EmptyState() {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <div>No users found</div>
    </div>
  )
}
