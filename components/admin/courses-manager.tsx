'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  ChevronDown,
  BookOpen,
  FileText,
  Trash2,
  Pencil,
} from 'lucide-react'

interface Lesson {
  id: string
  module_id: string
  title: string
  content: string | null
  lesson_type: string
  sort_order: number
}

interface Module {
  id: string
  course_id: string
  title: string
  sort_order: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string | null
  week_number: number | null
  modules: Module[]
}

export function CoursesManager({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses)
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [showAddModule, setShowAddModule] = useState<string | null>(null)
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const router = useRouter()

  const refreshCourses = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('courses')
      .select(`*, modules:modules(*, lessons:lessons(*))`)
      .order('week_number', { ascending: true })
    if (data) setCourses(data)
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course and all its content?')) return
    const supabase = createClient()
    await supabase.from('courses').delete().eq('id', id)
    await refreshCourses()
  }

  const deleteModule = async (id: string) => {
    if (!confirm('Delete this module and all its lessons?')) return
    const supabase = createClient()
    await supabase.from('modules').delete().eq('id', id)
    await refreshCourses()
  }

  const deleteLesson = async (id: string) => {
    if (!confirm('Delete this lesson?')) return
    const supabase = createClient()
    await supabase.from('lessons').delete().eq('id', id)
    await refreshCourses()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{courses.length} course(s)</p>
        <Dialog open={showAddCourse} onOpenChange={setShowAddCourse}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Course</DialogTitle>
            </DialogHeader>
            <AddCourseForm
              onSuccess={() => {
                setShowAddCourse(false)
                refreshCourses()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No courses yet. Add your first course to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                        <div>
                          <CardTitle className="text-lg text-card-foreground">
                            {course.week_number ? `WK${course.week_number}: ` : ''}{course.title}
                          </CardTitle>
                          {course.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">{course.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCourse(course.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="flex flex-col gap-3 ml-7">
                      {course.modules
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((module) => (
                          <div key={module.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-sm text-foreground">{module.title}</h3>
                              <div className="flex items-center gap-1">
                                <Dialog
                                  open={showAddLesson === module.id}
                                  onOpenChange={(v) => setShowAddLesson(v ? module.id : null)}
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                      <Plus className="h-3 w-3" /> Lesson
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle className="text-foreground">Add Lesson to {module.title}</DialogTitle>
                                    </DialogHeader>
                                    <AddLessonForm
                                      moduleId={module.id}
                                      onSuccess={() => {
                                        setShowAddLesson(null)
                                        refreshCourses()
                                      }}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => deleteModule(module.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              {module.lessons
                                .sort((a, b) => a.sort_order - b.sort_order)
                                .map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center justify-between rounded-md px-3 py-2 bg-muted/50 text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <LessonTypeIcon type={lesson.lesson_type} />
                                      <span className="text-foreground">{lesson.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded">
                                        {lesson.lesson_type}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                        onClick={() => deleteLesson(lesson.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}

                      <Dialog
                        open={showAddModule === course.id}
                        onOpenChange={(v) => setShowAddModule(v ? course.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2 w-fit">
                            <Plus className="h-3 w-3" /> Add Module
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Add Module to {course.title}</DialogTitle>
                          </DialogHeader>
                          <AddModuleForm
                            courseId={course.id}
                            onSuccess={() => {
                              setShowAddModule(null)
                              refreshCourses()
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function LessonTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'quiz':
      return <span className="text-primary text-xs font-bold">Q</span>
    case 'flashcard':
      return <span className="text-accent text-xs font-bold">F</span>
    case 'attachment':
      return <FileText className="h-3 w-3 text-muted-foreground" />
    default:
      return <span className="w-1.5 h-1.5 rounded-full bg-primary" />
  }
}

function AddCourseForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [weekNumber, setWeekNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('courses').insert({
      title,
      description: description || null,
      week_number: weekNumber ? parseInt(weekNumber) : null,
      created_by: user?.id,
    })
    setLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Course Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Intro to Cybersec" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course overview..." />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="week">Week Number</Label>
        <Input id="week" type="number" value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} placeholder="1" />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Course'}</Button>
    </form>
  )
}

function AddModuleForm({ courseId, onSuccess }: { courseId: string; onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('modules').insert({
      course_id: courseId,
      title,
      sort_order: parseInt(sortOrder) || 0,
    })
    setLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="mod-title">Module Title</Label>
        <Input id="mod-title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Understanding Cybersecurity" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sort">Sort Order</Label>
        <Input id="sort" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Module'}</Button>
    </form>
  )
}

function AddLessonForm({ moduleId, onSuccess }: { moduleId: string; onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [lessonType, setLessonType] = useState('lesson')
  const [sortOrder, setSortOrder] = useState('0')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('lessons').insert({
      module_id: moduleId,
      title,
      content: content || null,
      lesson_type: lessonType,
      sort_order: parseInt(sortOrder) || 0,
    })
    setLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="lesson-title">Lesson Title</Label>
        <Input id="lesson-title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. What is Cybersecurity?" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lesson-type">Type</Label>
        <Select value={lessonType} onValueChange={setLessonType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lesson">Lesson</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="flashcard">FlashCard</SelectItem>
            <SelectItem value="attachment">Attachment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lesson-content">Content</Label>
        <Textarea id="lesson-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Lesson content..." rows={6} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lesson-sort">Sort Order</Label>
        <Input id="lesson-sort" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Lesson'}</Button>
    </form>
  )
}
