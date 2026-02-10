import { Outlet, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { getMe, logout } from "@/api/auth"
import { Button } from "@/components/ui/button"

type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN"

export default function AppLayout() {
  const navigate = useNavigate()

  const {
    data: me,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  })

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  if (isLoading) return null

  if (isError || !me) {
    navigate("/login")
    return null
  }

  const role: Role = me.role

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-4 space-y-4">
        <h2 className="text-lg font-semibold">LMS</h2>

        {role === "STUDENT" && (
          <button onClick={() => navigate("/student/dashboard")}>
            Dashboard
          </button>
        )}
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="h-14 border-b px-6 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Role: {role}
          </span>

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* 👇 THIS IS CRITICAL */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
