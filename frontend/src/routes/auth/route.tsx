import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
