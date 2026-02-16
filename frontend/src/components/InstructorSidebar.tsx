import { useNavigate, useLocation } from "@tanstack/react-router"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  type LucideIcon,
} from "lucide-react"

type MenuItem = {
  label: string
  icon: LucideIcon
  path: string
}

export function InstructorSidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const menu: MenuItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/instructor/dashboard" },
    { label: "My Courses", icon: BookOpen, path: "/instructor/courses" },
    { label: "Users", icon: Users, path: "/instructor/students" },
    { label: "Profile", icon: User, path: "/instructor/profile" },
  ]

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6 border-b">
        <h2 className="font-semibold text-lg">
          Instructor Panel 🎓
        </h2>
        <p className="text-xs text-muted-foreground">
          Teaching Dashboard
        </p>
      </div>

      <nav className="p-3 space-y-1">
        {menu.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
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
