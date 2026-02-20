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
import { useAuth } from "@/lib/auth-context"
import { permissions } from "@/lib/permissions"

export function HigherupsSidebar() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: s => s.location.pathname,
  })

  const { user } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => navigate({ to: "/auth/login" }),
  })

  if (!user) return null

  const isAdmin      = permissions.isAdmin(user)
  const isInstructor = permissions.isInstructor(user)

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/higherups/dashboard" },
    { label: "Courses",   icon: BookOpen,        path: "/higherups/courses"   },

    ...(isInstructor
      ? [{ label: "My Courses", icon: BookOpen, path: "/higherups/mycourses" }]
      : []),

    ...(isAdmin
      ? [
          { label: "Students",    icon: Users,          path: "/higherups/students"     },
          { label: "Instructors", icon: GraduationCap,  path: "/higherups/instructors"  },
        ]
      : []),

    { label: "Profile", icon: User, path: "/higherups/profile" },
  ]

  return (
    <>
      {/*
       * Invisible spacer — sits in normal document flow and reserves w-64,
       * so every page that renders <HigherupsSidebar /> is automatically
       * pushed right by exactly the sidebar width. No ml-64 needed anywhere.
       */}
      <div className="w-64 shrink-0" aria-hidden="true" />

      {/* Fixed sidebar — visually overlays the spacer */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r bg-background flex flex-col h-screen overflow-hidden">

        {/* Branding */}
        <div className="p-6 border-b shrink-0">
          <h2 className="font-semibold text-lg">
            {isAdmin ? "Admin Panel 🛠️" : "Instructor Panel 🎓"}
          </h2>
          <p className="text-xs text-muted-foreground">LMS Management</p>
        </div>

        {/* Nav — scrollable if many items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menu.map(item => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.path)

            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
                  ${isActive
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

        {/* Logout — always pinned to bottom */}
        <div className="p-3 border-t shrink-0">
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </aside>
    </>
  )
}