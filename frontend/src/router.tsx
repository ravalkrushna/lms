import {
  Outlet,
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router"

import { getMe } from "@/api/auth"

import AppLayout from "@/components/AppLayout"

import Login from "@/pages/auth/Login"
import SignupPage from "@/pages/auth/Signup"
import VerifyOtp from "@/pages/auth/VerifyOtp"

import StudentDashboard from "@/pages/student/StudentDashboard"
import CourseDetail from "@/pages/student/CourseDetail"
import LessonView from "@/pages/student/LessonView"
import InstructorDashboard from "@/pages/instructor/InstructorDashboard"
import AdminDashboard from "@/pages/admin/AdminDashboard"

//
// ✅ Types
//
type Role = "STUDENT" | "INSTRUCTOR" | "ADMIN"

type RouterContext = {
  user: {
    role: Role
  }
}

//
// ✅ Root Route
//
const rootRoute = createRootRoute<RouterContext>({
  component: () => <Outlet />,
})

//
// ✅ "/" → Redirect to Login
//
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" })
  },
})

//
// ✅ Public Routes
//
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
})

const verifyOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-otp",
  component: VerifyOtp,
})

//
// ✅ Protected Layout → "/dashboard"
//
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",

  beforeLoad: async () => {
    try {
      const user = await getMe()
      return { user }
    } catch {
      throw redirect({ to: "/login" })
    }
  },

  component: AppLayout,
})

//
// 🔥 Role Guard
//
const requireRole =
  (role: Role) =>
  ({ context }: { context: RouterContext }) => {
    if (context.user.role !== role) {
      throw redirect({ to: "/login" })
    }
  }

//
// ✅ Student Routes
//
const studentDashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "student",
  beforeLoad: requireRole("STUDENT"),
  component: StudentDashboard,
})

const studentCourseRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "student/courses/$courseId",
  beforeLoad: requireRole("STUDENT"),
  component: CourseDetail,
})

const studentLessonRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "student/courses/$courseId/lessons/$lessonId",
  beforeLoad: requireRole("STUDENT"),
  component: LessonView,
})

//
// ✅ Instructor Route
//
const instructorDashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "instructor",
  beforeLoad: requireRole("INSTRUCTOR"),
  component: InstructorDashboard,
})

//
// ✅ Admin Route
//
const adminDashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "admin",
  beforeLoad: requireRole("ADMIN"),
  component: AdminDashboard,
})

//
// ✅ Route Tree
//
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  verifyOtpRoute,

  appLayoutRoute.addChildren([
    studentDashboardRoute,
    studentCourseRoute,
    studentLessonRoute,
    instructorDashboardRoute,
    adminDashboardRoute,
  ]),
])

//
// ✅ Router
//
export const router = createRouter({
  routeTree,

  context: {
    user: undefined!,
  },

  defaultNotFoundComponent: () => (
    <div className="flex h-screen items-center justify-center text-xl font-semibold">
      404 - Page Not Found
    </div>
  ),
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
