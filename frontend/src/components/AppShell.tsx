import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Link, useRouterState, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { logoutAction } from "@/lib/auth"

import {
    LayoutDashboard,
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

            {/* ✅ SIDEBAR */}
            <aside className="w-64 bg-background border-r hidden md:flex flex-col">

                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b font-semibold">
                    LMS
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">

                    <SidebarLink
                        to="/student/dashboard"
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard"
                        active={location.pathname === "/student/dashboard"}
                    />

                    <SidebarLink
                        to="/student/profile"
                        icon={<User size={18} />}
                        label="Profile"
                        active={location.pathname === "/student/profile"}
                    />

                </nav>
            </aside>

            {/* ✅ MAIN */}
            <div className="flex-1 flex flex-col">

                {/* ✅ HEADER  */}
                <header className="h-16 border-b bg-background flex items-center justify-between px-6">

                    <h1 className="text-lg font-semibold">
                        {title}
                    </h1>

                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        size="sm"
                        onClick={() => logoutMutation.mutate()}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>

                </header>


                {/* CONTENT */}
                <main className="flex-1 p-6">
                    {children}
                </main>

                {/* FOOTER */}
                <footer className="h-12 border-t bg-background flex items-center px-6 text-sm text-muted-foreground">
                    © LMS • Learning Management System 😎
                </footer>

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
        ${active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
        >
            {icon}
            {label}
        </Link>
    )
}
