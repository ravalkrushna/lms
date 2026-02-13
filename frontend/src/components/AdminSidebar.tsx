import { useNavigate, useRouterState } from "@tanstack/react-router"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  BarChart3,
  Settings,
} from "lucide-react"

export function AdminSidebar() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: s => s.location.pathname,
  })

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Courses", icon: BookOpen, path: "/admin/courses" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { label: "Profile", icon: User, path: "/admin/profile" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ]

  return (
    <aside className="w-64 border-r bg-background">

      {/* ✅ Header */}
      <div className="p-6 border-b">
        <h2 className="font-semibold text-lg">
          Admin Panel 🛠️
        </h2>
        <p className="text-xs text-muted-foreground">
          LMS Management
        </p>
      </div>

      {/* ✅ Navigation */}
      <nav className="p-3 space-y-1">

        {menu.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
                ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-600"
                    : "hover:bg-muted"
                }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}

      </nav>
    </aside>
  )
}
