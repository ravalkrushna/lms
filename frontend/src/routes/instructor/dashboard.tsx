import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/instructor/dashboard")({
  component: InstructorDashboard,
})

function InstructorDashboard() {
  return <div className="p-6">Instructor Dashboard 👨‍🏫</div>
}
