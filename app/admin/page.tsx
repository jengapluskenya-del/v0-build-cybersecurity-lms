import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, GraduationCap, FileText } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [coursesRes, studentsRes, lessonsRes, enrollmentsRes] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
    supabase.from('lessons').select('id', { count: 'exact' }),
    supabase.from('enrollments').select('id', { count: 'exact' }),
  ])

  const stats = [
    {
      title: 'Total Courses',
      value: coursesRes.count ?? 0,
      icon: BookOpen,
    },
    {
      title: 'Total Students',
      value: studentsRes.count ?? 0,
      icon: Users,
    },
    {
      title: 'Total Lessons',
      value: lessonsRes.count ?? 0,
      icon: FileText,
    },
    {
      title: 'Enrollments',
      value: enrollmentsRes.count ?? 0,
      icon: GraduationCap,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your LMS platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
