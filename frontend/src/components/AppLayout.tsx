import {
  Outlet,
  useNavigate,
  useRouteContext,
  useRouterState,
} from "@tanstack/react-router"

import { logout } from "@/api/auth"
import { Button } from "@/components/ui/button"

import { buildBreadcrumbs } from "@/lib/breadcrumbs"

import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  User,
  GraduationCap,
  Shield,
} from "lucide-react"

export default function AppLayout() {
  const navigate = useNavigate()
  const router = useRouterState()

  const { user } = useRouteContext({ from: "/dashboard" })

  const pathname = router.location.pathname
  const breadcrumbs = buildBreadcrumbs(pathname)

  const handleLogout = async () => {
    await logout()
    navigate({ to: "/login" })
  }

  return (
    <div className="flex h-screen bg-background">

      {/* ✅ SIDEBAR */}
      <aside className="w-64 border-r bg-muted/30 backdrop-blur-sm">

        <div className="h-full flex flex-col">

          {/* Logo */}
          <div className="h-14 flex items-center px-5 border-b">
            <h2 className="text-lg font-semibold tracking-tight">
              LMS
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-6">

            {user?.role === "STUDENT" && (
              <SidebarSection title="Learning">

                <SidebarItem
                  icon={<LayoutDashboard size={16} />}
                  label="Dashboard"
                  active={pathname === "/dashboard/student"}
                  onClick={() =>
                    navigate({ to: "/dashboard/student" })
                  }
                />

                <SidebarItem
                  icon={<BookOpen size={16} />}
                  label="My Courses"
                  onClick={() =>
                    navigate({ to: "/dashboard/student" })
                  }
                />

                <SidebarItem
                  icon={<BarChart3 size={16} />}
                  label="Progress"
                  onClick={() =>
                    navigate({ to: "/dashboard/student" })
                  }
                />

                <SidebarItem
                  icon={<User size={16} />}
                  label="Profile"
                  onClick={() =>
                    navigate({ to: "/dashboard/student" })
                  }
                />

              </SidebarSection>
            )}

            {user?.role === "INSTRUCTOR" && (
              <SidebarSection title="Instructor">

                <SidebarItem
                  icon={<GraduationCap size={16} />}
                  label="Dashboard"
                  active={pathname === "/dashboard/instructor"}
                  onClick={() =>
                    navigate({ to: "/dashboard/instructor" })
                  }
                />

              </SidebarSection>
            )}

            {user?.role === "ADMIN" && (
              <SidebarSection title="Administration">

                <SidebarItem
                  icon={<Shield size={16} />}
                  label="Dashboard"
                  active={pathname === "/dashboard/admin"}
                  onClick={() =>
                    navigate({ to: "/dashboard/admin" })
                  }
                />

              </SidebarSection>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground">
              Learning Portal
            </p>
          </div>
        </div>
      </aside>

      {/* ✅ MAIN */}
      <div className="flex flex-1 flex-col">

        {/* ✅ HEADER (CLEAN + BALANCED) */}
        <header className="h-14 border-b bg-background/80 backdrop-blur-sm">

          <div className="h-full px-8 flex items-center justify-between">

            {/* LEFT → Breadcrumbs */}
            <div className="flex items-center text-xs text-muted-foreground">

              {breadcrumbs.map((crumb, index) => (
                <div key={crumb} className="flex items-center">
                  {index !== 0 && (
                    <span className="mx-1">/</span>
                  )}
                  <span>{crumb}</span>
                </div>
              ))}

            </div>

            {/* RIGHT → Identity + Logout */}
            <div className="flex items-center gap-4">

              <div className="flex items-center gap-2">

                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {user.email.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm font-medium">
                  {user.email}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* ✅ CONTENT */}
        <main className="flex-1 p-8 overflow-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/* ✅ SIDEBAR SECTION */
function SidebarSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

/* ✅ SIDEBAR ITEM */
function SidebarItem({
  label,
  icon,
  onClick,
  active,
}: {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  active?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200

      ${active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm"}
      `}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}
