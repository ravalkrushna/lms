import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),

  // ✅ FIXED
  notFoundComponent: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">404</h1>
        <p className="text-muted-foreground">
          Page not found
        </p>
      </div>
    </div>
  ),
})
