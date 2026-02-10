import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { logout } from "@/api/auth"

export default function StudentDashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>

      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
