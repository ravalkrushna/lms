export function buildBreadcrumbs(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs: string[] = []

  if (segments.includes("student")) {
    breadcrumbs.push("Dashboard")
  }

  if (segments.includes("courses")) {
    breadcrumbs.push("Courses")
  }

  if (segments.includes("lessons")) {
    breadcrumbs.push("Lesson")
  }

  return breadcrumbs
}
