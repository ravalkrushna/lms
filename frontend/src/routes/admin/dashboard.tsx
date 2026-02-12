import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
})

function AdminDashboard() {
  return <div className="p-6">Admin Dashboard ⚙️</div>
}
