import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { getMe } from "@/api/auth"

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    getMe()
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null 

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
