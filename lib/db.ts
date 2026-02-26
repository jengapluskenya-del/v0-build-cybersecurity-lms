import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL || '')

/**
 * Get user profile by email
 */
export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, email, full_name, role, created_at
    FROM public.profiles
    WHERE email = ${email}
    LIMIT 1
  `
  return result[0] || null
}

/**
 * Get user profile by ID
 */
export async function getUserById(userId: string) {
  const result = await sql`
    SELECT id, email, full_name, role, created_at
    FROM public.profiles
    WHERE id = ${userId}
    LIMIT 1
  `
  return result[0] || null
}

/**
 * Get all courses with filtering
 */
export async function getCourses(filters?: {
  status?: string
  instructor_id?: string
}) {
  let query = sql`
    SELECT 
      id, title, description, week_number, cover_image,
      thumbnail, status, is_published, instructor_id, created_by,
      created_at, updated_at
    FROM public.courses
    WHERE 1=1
  `

  if (filters?.status) {
    query = sql`
      SELECT 
        id, title, description, week_number, cover_image,
        thumbnail, status, is_published, instructor_id, created_by,
        created_at, updated_at
      FROM public.courses
      WHERE status = ${filters.status}
    `
  }

  return await query
}

/**
 * Get course by ID with modules and lessons
 */
export async function getCourseById(courseId: string) {
  const course = await sql`
    SELECT 
      id, title, description, week_number, cover_image,
      thumbnail, status, is_published, instructor_id, created_by,
      created_at, updated_at
    FROM public.courses
    WHERE id = ${courseId}
  `

  if (!course[0]) return null

  const modules = await sql`
    SELECT id, course_id, title, sort_order, created_at
    FROM public.modules
    WHERE course_id = ${courseId}
    ORDER BY sort_order
  `

  const lessons = await sql`
    SELECT 
      l.id, l.module_id, l.title, l.content, l.lesson_type,
      l.sort_order, l.video_url, l.video_embed_code,
      l.resource_url, l.duration_minutes, l.created_at, l.updated_at
    FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    WHERE m.course_id = ${courseId}
    ORDER BY m.sort_order, l.sort_order
  `

  return {
    ...course[0],
    modules,
    lessons,
  }
}

/**
 * Get student enrollments
 */
export async function getStudentEnrollments(studentId: string) {
  return await sql`
    SELECT 
      e.id, e.course_id, e.enrolled_at, e.enrollment_status,
      c.title, c.description, c.thumbnail, c.is_published
    FROM public.enrollments e
    JOIN public.courses c ON e.course_id = c.id
    WHERE e.student_id = ${studentId}
    ORDER BY e.enrolled_at DESC
  `
}

/**
 * Get student progress for a course
 */
export async function getStudentCourseProgress(
  studentId: string,
  courseId: string
) {
  const enrollments = await sql`
    SELECT id FROM public.enrollments
    WHERE student_id = ${studentId} AND course_id = ${courseId}
  `

  if (!enrollments[0]) return null

  const progress = await sql`
    SELECT 
      COUNT(*) as total_lessons,
      SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_lessons
    FROM public.lesson_progress lp
    JOIN public.lessons l ON lp.lesson_id = l.id
    JOIN public.modules m ON l.module_id = m.id
    WHERE lp.student_id = ${studentId} AND m.course_id = ${courseId}
  `

  const result = progress[0]
  const totalLessons = parseInt(result.total_lessons) || 0
  const completedLessons = parseInt(result.completed_lessons) || 0

  return {
    totalLessons,
    completedLessons,
    progressPercentage:
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0,
  }
}

/**
 * Get all students with progress stats
 */
export async function getAllStudentsWithProgress() {
  return await sql`
    SELECT 
      p.id, p.email, p.full_name,
      COUNT(DISTINCT e.course_id) as enrolled_courses,
      COUNT(DISTINCT CASE WHEN lp.completed THEN lp.id END) as completed_lessons
    FROM public.profiles p
    LEFT JOIN public.enrollments e ON p.id = e.student_id
    LEFT JOIN public.lesson_progress lp ON p.id = lp.student_id
    WHERE p.role = 'student'
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `
}

/**
 * Get admin dashboard stats
 */
export async function getAdminDashboardStats() {
  const [
    totalStudents,
    totalCourses,
    pendingCourses,
    activeEnrollments,
    totalLessons,
  ] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM public.profiles WHERE role = 'student'`,
    sql`SELECT COUNT(*) as count FROM public.courses WHERE is_published = true`,
    sql`SELECT COUNT(*) as count FROM public.courses WHERE status = 'pending'`,
    sql`SELECT COUNT(*) as count FROM public.enrollments WHERE enrollment_status = 'active'`,
    sql`SELECT COUNT(*) as count FROM public.lessons`,
  ])

  return {
    totalStudents: totalStudents[0]?.count || 0,
    totalCourses: totalCourses[0]?.count || 0,
    pendingCourses: pendingCourses[0]?.count || 0,
    activeEnrollments: activeEnrollments[0]?.count || 0,
    totalLessons: totalLessons[0]?.count || 0,
  }
}

/**
 * Get pending courses for review
 */
export async function getPendingCourses() {
  return await sql`
    SELECT 
      id, title, description, thumbnail, instructor_id,
      status, created_at, updated_at
    FROM public.courses
    WHERE status = 'pending'
    ORDER BY created_at DESC
  `
}

/**
 * Update course status
 */
export async function updateCourseStatus(
  courseId: string,
  status: 'draft' | 'pending' | 'published' | 'rejected'
) {
  return await sql`
    UPDATE public.courses
    SET status = ${status}, is_published = ${status === 'published'}
    WHERE id = ${courseId}
  `
}

/**
 * Check if user has role
 */
export async function userHasRole(userId: string, role: string) {
  const result = await sql`
    SELECT role FROM public.profiles WHERE id = ${userId}
  `
  return result[0]?.role === role
}

/**
 * Check if user is admin or super_admin
 */
export async function isUserAdmin(userId: string) {
  const result = await sql`
    SELECT role FROM public.profiles WHERE id = ${userId}
  `
  const userRole = result[0]?.role
  return userRole === 'admin' || userRole === 'super_admin'
}
