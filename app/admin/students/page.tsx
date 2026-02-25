import { createClient } from '@/lib/supabase/server'
import { StudentsManager } from '@/components/admin/students-manager'

export default async function StudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, week_number')
    .order('week_number', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Students</h1>
        <p className="text-muted-foreground mt-1">Manage student accounts and enrollments</p>
      </div>
      <StudentsManager initialStudents={students || []} courses={courses || []} />
    </div>
  )
}
