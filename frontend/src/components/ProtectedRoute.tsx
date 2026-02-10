import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { getMe } from "@/api/auth"

type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN"

type Props = {
  children: React.ReactNode
  allowedRoles: Role[]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    getMe()
      .then((me) => {
        if (allowedRoles.includes(me.role)) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
      })
      .catch(() => setAuthorized(false))
      .finally(() => setLoading(false))
  }, [allowedRoles])

  if (loading) return null

  if (!authorized) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
