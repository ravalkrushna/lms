import { Routes, Route, Navigate } from "react-router-dom"

import Login from "@/pages/auth/Login"
import SignupPage from "@/pages/auth/Signup"
import VerifyOtp from "@/pages/auth/VerifyOtp"

import ProtectedRoute from "@/components/ProtectedRoute"
import AppLayout from "@/components/AppLayout"

import StudentDashboard from "@/pages/student/StudentDashboard"
import CourseDetail from "@/pages/student/CourseDetail"
import InstructorDashboard from "@/pages/instructor/InstructorDashboard"
import AdminDashboard from "@/pages/admin/AdminDashboard"

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />

      {/* STUDENT */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />
        <Route
          path="/student/courses/:courseId"
          element={<CourseDetail />}
        />
      </Route>

      {/* INSTRUCTOR */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["INSTRUCTOR"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/instructor/dashboard"
          element={<InstructorDashboard />}
        />
      </Route>

      {/* ADMIN */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
