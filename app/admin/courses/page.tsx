import { createClient } from '@/lib/supabase/server'
import { CoursesManager } from '@/components/admin/courses-manager'

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      modules:modules(
        *,
        lessons:lessons(*)
      )
    `)
    .order('week_number', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Courses</h1>
        <p className="text-muted-foreground mt-1">Manage your cybersecurity courses and lessons</p>
      </div>
      <CoursesManager initialCourses={courses || []} />
    </div>
  )
}
