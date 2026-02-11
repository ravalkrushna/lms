import {
  Outlet,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router"

import { logout } from "@/api/auth"
import { Button } from "@/components/ui/button"

export default function AppLayout() {
  const navigate = useNavigate()

  const { user } = useRouteContext({ from: "/dashboard" })

  const handleLogout = async () => {
    await logout()
    navigate({ to: "/login" })
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/40 p-4 space-y-4">
        <h2 className="text-lg font-semibold">LMS</h2>

        {user?.role === "STUDENT" && (
          <button onClick={() =>
            navigate({ to: "/dashboard/student" })
          }>
            Dashboard
          </button>
        )}

        {user?.role === "INSTRUCTOR" && (
          <button onClick={() =>
            navigate({ to: "/dashboard/instructor" })
          }>
            Instructor Dashboard
          </button>
        )}

        {user?.role === "ADMIN" && (
          <button onClick={() =>
            navigate({ to: "/dashboard/admin" })
          }>
            Admin Dashboard
          </button>
        )}
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="h-14 border-b px-6 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Role: {user.role}
          </span>

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
