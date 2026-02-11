import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { logout } from "@/api/auth"

export default function AdminDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: "/login" })
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <p className="text-muted-foreground">
        Platform administration 👋
      </p>

      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
