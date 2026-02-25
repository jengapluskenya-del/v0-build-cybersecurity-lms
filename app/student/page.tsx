import { createClient } from '@/lib/supabase/server'
import { CoursesList } from '@/components/student/courses-list'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get enrolled courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      course_id,
      courses:course_id(
        *,
        modules:modules(
          *,
          lessons:lessons(*)
        )
      )
    `)
    .eq('student_id', user!.id)

  const courses = enrollments?.map((e: any) => e.courses).filter(Boolean) || []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Courses</h1>
        <p className="text-muted-foreground mt-1">Access your enrolled cybersecurity courses</p>
      </div>
      <CoursesList courses={courses} studentId={user!.id} />
    </div>
  )
}
