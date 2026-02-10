import { Routes, Route, Navigate } from "react-router-dom"

import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"

import ProtectedRoute from "@/components/ProtectedRoute"
import StudentDashboard from "./pages/student/StudentDashboard"
import InstructorDashboard from "./pages/instructor/InstructorDashboard"
import AdminDashboard from "./pages/admin/AdminDashboard"

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
