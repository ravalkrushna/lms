/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { getProfile } from "./higherups"

type AuthContextType = {
  user: any | null
  isLoading: boolean
}

/* ✅ NEVER NULL CONTEXT */
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const { data, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getProfile,
    retry: false,
  })

  /* ✅ STABLE VALUE SHAPE */
  const value: AuthContextType = {
    user: data ?? null,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/* ✅ SAFE HOOK */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
