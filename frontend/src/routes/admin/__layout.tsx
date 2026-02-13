import { createFileRoute, Outlet } from "@tanstack/react-router"
import { AdminSidebar } from "@/components/AdminSidebar"

export const Route = createFileRoute("/admin/__layout")({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

      <main className="flex-1 p-6 bg-muted/30">
        <Outlet />
      </main>

    </div>
  )
}
