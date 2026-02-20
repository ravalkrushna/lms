import type { ReactNode } from "react"
import { Link, useRouterState, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { logoutAction } from "@/lib/auth"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  User,
  LogOut,
} from "lucide-react"

export function AppShell({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  const { location } = useRouterState()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => navigate({ to: "/auth/login" }),
  })

  return (
    <div className="min-h-screen flex bg-muted/30">

      {/*
       * Invisible spacer — sits in normal document flow and reserves w-64,
       * so every page is automatically pushed right by the sidebar width.
       * No ml-64 needed on any page.
       */}
      <div className="w-64 shrink-0 hidden md:block" aria-hidden="true" />

      {/* Fixed sidebar — visually overlays the spacer */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r hidden md:flex flex-col h-screen overflow-hidden">

        {/* Branding */}
        <div className="h-16 flex items-center px-6 border-b font-semibold shrink-0">
          LMS
        </div>

        {/* Nav — scrollable if many links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <SidebarLink
            to="/student/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={location.pathname === "/student/dashboard"}
          />
          <SidebarLink
            to="/student/courses"
            icon={<BookOpen size={18} />}
            label="Courses"
            active={location.pathname.startsWith("/student/courses")}
          />
          <SidebarLink
            to="/student/my-courses"
            icon={<GraduationCap size={18} />}
            label="My Courses"
            active={location.pathname.startsWith("/student/my-courses")}
          />
          <SidebarLink
            to="/student/profile"
            icon={<User size={18} />}
            label="Profile"
            active={location.pathname === "/student/profile"}
          />
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-background flex items-center px-6 sticky top-0 z-30">
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>

    </div>
  )
}

function SidebarLink({
  to,
  icon,
  label,
  active,
}: {
  to: string
  icon: ReactNode
  label: string
  active: boolean
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
        ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
    >
      {icon}
      {label}
    </Link>
  )
}