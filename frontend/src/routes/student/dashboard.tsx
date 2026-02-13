/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { AppShell } from "@/components/AppShell"
import { getEnrolledCourses } from "@/lib/student"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  BookOpen,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  Target,
  Sparkles,
  ChevronRight,
} from "lucide-react"

export const Route = createFileRoute("/student/dashboard")({
  component: StudentDashboard,
})

function StudentDashboard() {
  const navigate = useNavigate()

  const { data: courses, isLoading } = useQuery({
    queryKey: ["student-courses"],
    queryFn: getEnrolledCourses,
  })

  const overallProgress = calculateOverallProgress(courses)
  const inProgressCourses = courses?.filter((c: any) => c.progressPercent > 0 && c.progressPercent < 100).length ?? 0
  const completedCourses = courses?.filter((c: any) => c.progressPercent === 100).length ?? 0

  return (
    <AppShell title="Student Dashboard 🎓">

      {/* ✅ Enhanced Welcome Section */}
      <Card className="bg-linear-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/5 border-indigo-200/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <CardContent className="p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, Scholar! 👋
              </h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Sparkles size={16} className="text-violet-500" />
                Continue your learning journey and achieve your goals 🚀
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/60">
              <div className="p-3 bg-linear-to-br from-indigo-500 to-violet-500 rounded-lg">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Learning Streak</div>
                <div className="text-2xl font-bold text-indigo-600">7 Days 🔥</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <EnhancedStatsCard
          icon={<GraduationCap size={20} />}
          label="Enrolled Courses"
          value={courses?.length ?? 0}
          subtitle="Active learning"
          color="indigo"
          trend={courses?.length ? "+1 this month" : "Get started"}
        />

        <EnhancedStatsCard
          icon={<BarChart3 size={20} />}
          label="Overall Progress"
          value={`${overallProgress}%`}
          subtitle="Keep it up!"
          color="violet"
          trend={overallProgress > 50 ? "Great progress!" : "You got this!"}
        />

        <EnhancedStatsCard
          icon={<Target size={20} />}
          label="In Progress"
          value={inProgressCourses}
          subtitle="Active courses"
          color="cyan"
          trend="Stay focused"
        />

        <EnhancedStatsCard
          icon={<Award size={20} />}
          label="Completed"
          value={completedCourses}
          subtitle="Achievements"
          color="emerald"
          trend={completedCourses > 0 ? "Well done! 🎉" : "First one soon!"}
        />

      </div>

      {/* ✅ Quick Actions Bar */}
      {courses && courses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <QuickActionCard
            icon={<TrendingUp size={18} />}
            title="Today's Goal"
            description="Complete 1 lesson"
            color="indigo"
          />
          <QuickActionCard
            icon={<Clock size={18} />}
            title="Study Time"
            description="2h 30m this week"
            color="violet"
          />
          <QuickActionCard
            icon={<Sparkles size={18} />}
            title="Next Milestone"
            description="50% completion"
            color="purple"
          />
        </div>
      )}

      {/* ✅ Enhanced Courses Section */}
      <Card className="border-2">
        <CardHeader className="bg-linear-to-r from-indigo-50 to-violet-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen size={20} className="text-indigo-600" />
                My Learning Journey 📚
              </CardTitle>
              <CardDescription className="mt-1">
                {courses?.length 
                  ? `${courses.length} course${courses.length > 1 ? 's' : ''} to master` 
                  : "Start your learning adventure today"}
              </CardDescription>
            </div>
            {courses && courses.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
              >
                Browse Courses
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-muted-foreground text-sm">Loading your courses...</p>
            </div>
          )}

          {!isLoading && (!courses || courses.length === 0) && (
            <EnhancedEmptyState />
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {courses?.map((course: any) => (
              <Card
                key={course.courseId}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-indigo-200 overflow-hidden relative"
              >
                {/* Progress indicator on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="p-2 bg-linear-to-br from-indigo-500/10 to-violet-500/10 rounded-lg group-hover:scale-110 transition-transform">
                      <BookOpen size={20} className="text-indigo-600" />
                    </div>
                    {course.progressPercent === 100 && (
                      <div className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-medium flex items-center gap-1">
                        <Award size={12} />
                        Complete
                      </div>
                    )}
                    {course.progressPercent > 0 && course.progressPercent < 100 && (
                      <div className="px-2 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-medium">
                        In Progress
                      </div>
                    )}
                    {course.progressPercent === 0 && (
                      <div className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-medium">
                        New
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-base leading-tight group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* ✅ Enhanced Progress Section */}
                  <div className="space-y-2">

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">Your Progress</span>
                      <span className="text-indigo-600 font-bold">{course.progressPercent}%</span>
                    </div>

                    <div className="relative h-3 rounded-full bg-linear-to-r from-gray-100 to-gray-200 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${course.progressPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>

                    {/* Progress Milestone */}
                    {course.progressPercent > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp size={12} className="text-emerald-500" />
                        <span>
                          {course.progressPercent < 25 && "Just getting started"}
                          {course.progressPercent >= 25 && course.progressPercent < 50 && "Making good progress"}
                          {course.progressPercent >= 50 && course.progressPercent < 75 && "Halfway there!"}
                          {course.progressPercent >= 75 && course.progressPercent < 100 && "Almost done!"}
                          {course.progressPercent === 100 && "Completed! 🎉"}
                        </span>
                      </div>
                    )}

                  </div>

                  <Button
                    className="w-full bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 gap-2 group-hover:shadow-lg transition-all"
                    onClick={() =>
                      navigate({
                        to: `/student/courses/${course.courseId}`,
                      })
                    }
                  >
                    {course.progressPercent === 0 && (
                      <>
                        <Sparkles size={16} />
                        Start Learning
                      </>
                    )}
                    {course.progressPercent > 0 && course.progressPercent < 100 && (
                      <>
                        <BookOpen size={16} />
                        Continue Learning
                      </>
                    )}
                    {course.progressPercent === 100 && (
                      <>
                        <Award size={16} />
                        Review Course
                      </>
                    )}
                  </Button>

                </CardContent>
              </Card>
            ))}

          </div>

        </CardContent>
      </Card>

    </AppShell>
  )
}

/* ✅ Enhanced Stats Card */
function EnhancedStatsCard({
  icon,
  label,
  value,
  subtitle,
  color,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle: string
  color: "indigo" | "violet" | "cyan" | "emerald"
  trend: string
}) {
  const styles = {
    indigo: "from-indigo-500 to-indigo-600 bg-indigo-500/10 text-indigo-600 border-indigo-200",
    violet: "from-violet-500 to-violet-600 bg-violet-500/10 text-violet-600 border-violet-200",
    cyan: "from-cyan-500 to-cyan-600 bg-cyan-500/10 text-cyan-600 border-cyan-200",
    emerald: "from-emerald-500 to-emerald-600 bg-emerald-500/10 text-emerald-600 border-emerald-200",
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-opacity-100 cursor-pointer overflow-hidden relative">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${styles[color]}`} />
      <CardContent className="p-5">
        
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-linear-to-br ${styles[color]} text-white group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">
            {label}
          </div>
          <div className={`text-xs flex items-center gap-1 ${styles[color].split(' ')[2]}`}>
            <TrendingUp size={12} />
            {trend}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

/* ✅ Quick Action Card */
function QuickActionCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: "indigo" | "violet" | "purple"
}) {
  const styles = {
    indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-200 text-indigo-600 hover:border-indigo-300",
    violet: "from-violet-500/10 to-violet-500/5 border-violet-200 text-violet-600 hover:border-violet-300",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-200 text-purple-600 hover:border-purple-300",
  }

  return (
    <Card className={`bg-linear-to-br ${styles[color]} hover:shadow-md transition-all cursor-pointer group`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/80 ${styles[color].split(' ')[3]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            {title}
          </div>
          <div className="text-xs text-muted-foreground">
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ✅ Enhanced Empty State */
function EnhancedEmptyState() {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-indigo-500/10 to-violet-500/10 mb-6">
        <BookOpen size={40} className="text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start your learning journey today! Browse our course catalog and enroll in courses that interest you.
      </p>
      <Button className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 gap-2">
        <Sparkles size={16} />
        Browse Available Courses
      </Button>
    </div>
  )
}

/* ✅ Overall Progress - UNCHANGED */
function calculateOverallProgress(courses: any[] | undefined) {
  if (!courses?.length) return 0

  const total = courses.reduce(
    (sum, c) => sum + (c.progressPercent ?? 0),
    0
  )

  return Math.round(total / courses.length)
}