import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Register() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Register Page</h1>

      <Link to="/login">
        <Button variant="outline">Back to Login</Button>
      </Link>
    </div>
  )
}
