/* eslint-disable @typescript-eslint/no-explicit-any */
export const permissions = {
  isAdmin(user: any) {
    return user?.role?.toUpperCase() === "ADMIN"
  },
  isInstructor(user: any) {
    return user?.role?.toUpperCase() === "INSTRUCTOR"
  },

  /* ---------- COURSES ---------- */
  canCreateCourse(user: any) {
    return this.isAdmin(user) || this.isInstructor(user)
  },
  canEditCourse(user: any, course: any) {
    if (this.isAdmin(user)) return true
    return course?.createdBy === user?.id
  },
  canDeleteCourse(user: any) {
    return this.isAdmin(user)
  },
  canPublishCourse(user: any) {
    return this.isAdmin(user)
  },
  canArchiveCourse(user: any) {
    return this.isAdmin(user)
  },

  /* ---------- SECTIONS ---------- */
  canCreateSection(user: any, course: any) {
    if (this.isAdmin(user)) return true
    // Instructor can only add sections to their own course
    return this.isInstructor(user) && course?.createdBy === user?.id
  },
  canEditSection(user: any, course: any) {
    if (this.isAdmin(user)) return true
    return this.isInstructor(user) && course?.createdBy === user?.id
  },
  canDeleteSection(user: any) {
    return this.isAdmin(user)
  },
  canReorderSections(user: any, course: any) {
    if (this.isAdmin(user)) return true
    return this.isInstructor(user) && course?.createdBy === user?.id
  },

  /* ---------- LESSONS ---------- */
  canCreateLesson(user: any, course: any) {
    if (this.isAdmin(user)) return true
    // Instructor can only add lessons to their own course
    return this.isInstructor(user) && course?.createdBy === user?.id
  },
  canEditLesson(user: any, course: any) {
    if (this.isAdmin(user)) return true
    return this.isInstructor(user) && course?.createdBy === user?.id
  },
  canDeleteLesson(user: any) {
    return this.isAdmin(user)
  },
  canReorderLessons(user: any, course: any) {
    if (this.isAdmin(user)) return true
    return this.isInstructor(user) && course?.createdBy === user?.id
  },
  canPublishLesson(user: any) {
    return this.isAdmin(user)
  },

  /* ---------- USERS ---------- */
  canViewUsers(user: any) {
    return this.isAdmin(user) || this.isInstructor(user)
  },
  canEditUsers(user: any) {
    return this.isAdmin(user)
  },

  /* ---------- PROFILE ---------- */
  canEditProfile(user: any, profileId: number) {
    if (this.isAdmin(user)) return true
    return user?.id === profileId
  },
}