import { useNavigate, useRouterState } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  User,
  LogOut,
} from "lucide-react"
import { logoutAction } from "@/lib/auth"


export function AdminSidebar() {
  const navigate = useNavigate()

  const pathname = useRouterState({
    select: s => s.location.pathname,
  })

  const logoutMutation = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      navigate({ to: "/auth/login" })
    },
  })

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Courses", icon: BookOpen, path: "/admin/courses" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Instructors", icon: GraduationCap, path: "/admin/instructor" },
    { label: "Profile", icon: User, path: "/admin/profile" },
  ]

  return (
    <aside className="w-64 border-r bg-background flex flex-col">

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
      <nav className="p-3 space-y-1 flex-1">

        {menu.map(item => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.path)

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

      {/* ✅ Logout Section */}
      <div className="p-3 border-t">
        <button
          onClick={() => logoutMutation.mutate()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all hover:bg-red-500/10 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </aside>
  )
}
