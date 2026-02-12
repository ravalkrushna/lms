import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/changepassword")({
  component: ChangePasswordPage,
})

function ChangePasswordPage() {
  return <div>Change Password Page</div>
}
