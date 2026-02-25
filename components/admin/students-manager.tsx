'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, UserPlus } from 'lucide-react'

interface Student {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

interface Course {
  id: string
  title: string
  week_number: number | null
}

export function StudentsManager({
  initialStudents,
  courses,
}: {
  initialStudents: Student[]
  courses: Course[]
}) {
  const [students, setStudents] = useState(initialStudents)
  const [showAdd, setShowAdd] = useState(false)
  const [enrollDialog, setEnrollDialog] = useState<string | null>(null)
  const [enrollCourse, setEnrollCourse] = useState('')
  const [enrollLoading, setEnrollLoading] = useState(false)

  const refreshStudents = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false })
    if (data) setStudents(data)
  }

  const enrollStudent = async (studentId: string) => {
    if (!enrollCourse) return
    setEnrollLoading(true)
    const supabase = createClient()
    await supabase.from('enrollments').insert({
      student_id: studentId,
      course_id: enrollCourse,
    })
    setEnrollLoading(false)
    setEnrollDialog(null)
    setEnrollCourse('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{students.length} student(s)</p>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">Register New Student</DialogTitle>
            </DialogHeader>
            <AddStudentForm
              onSuccess={() => {
                setShowAdd(false)
                refreshStudents()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No students yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium text-foreground">
                      {student.full_name || 'No name'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={enrollDialog === student.id}
                        onOpenChange={(v) => setEnrollDialog(v ? student.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-3 w-3" /> Enroll
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Enroll {student.full_name || student.email}</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-4">
                            <Label>Select Course</Label>
                            <select
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                              value={enrollCourse}
                              onChange={(e) => setEnrollCourse(e.target.value)}
                            >
                              <option value="">Choose a course...</option>
                              {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.week_number ? `WK${c.week_number}: ` : ''}{c.title}
                                </option>
                              ))}
                            </select>
                            <Button
                              onClick={() => enrollStudent(student.id)}
                              disabled={!enrollCourse || enrollLoading}
                            >
                              {enrollLoading ? 'Enrolling...' : 'Enroll Student'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AddStudentForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role: 'student' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create student')
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="student-name">Full Name</Label>
        <Input id="student-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="student-email">Email</Label>
        <Input id="student-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="student@email.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="student-pass">Password</Label>
        <Input id="student-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Student'}</Button>
    </form>
  )
}
