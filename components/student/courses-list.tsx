'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { BookOpen, ChevronRight, FileText, ChevronDown } from 'lucide-react'
import { LessonViewer } from './lesson-viewer'

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

export function CoursesList({
  courses,
  studentId,
}: {
  courses: Course[]
  studentId: string
}) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set(courses.map((c) => c.id))
  )

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Courses Yet</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {"You haven't been enrolled in any courses yet. Contact your admin to get started."}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (selectedLesson) {
    return (
      <LessonViewer
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <Collapsible
            open={expandedCourses.has(course.id)}
            onOpenChange={(open) => {
              setExpandedCourses((prev) => {
                const next = new Set(prev)
                if (open) next.add(course.id)
                else next.delete(course.id)
                return next
              })
            }}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors bg-sidebar text-sidebar-foreground">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {course.week_number ? `WK${course.week_number}: ` : ''}{course.title}
                  </CardTitle>
                  <ChevronDown className={`h-5 w-5 transition-transform ${expandedCourses.has(course.id) ? '' : '-rotate-90'}`} />
                </div>
                {course.description && (
                  <p className="text-sm text-sidebar-foreground/70 mt-1">{course.description}</p>
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-0">
                {course.modules
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((module) => (
                    <div key={module.id} className="border-b border-border last:border-0">
                      <div className="px-6 py-3 bg-muted/30">
                        <h3 className="text-sm font-semibold text-foreground">{module.title}</h3>
                      </div>
                      <div className="flex flex-col">
                        {module.lessons
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className="flex items-center gap-3 px-6 py-3 text-left hover:bg-muted/50 transition-colors border-t border-border/50 first:border-0"
                            >
                              <LessonIcon type={lesson.lesson_type} />
                              <span className="text-sm text-foreground">{lesson.title}</span>
                              <span className="ml-auto text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded">
                                {lesson.lesson_type}
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  )
}

function LessonIcon({ type }: { type: string }) {
  switch (type) {
    case 'quiz':
      return (
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
          Q
        </span>
      )
    case 'flashcard':
      return (
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent text-xs font-bold">
          F
        </span>
      )
    case 'attachment':
      return (
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <FileText className="h-4 w-4" />
        </span>
      )
    default:
      return (
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
          <span className="w-2 h-2 rounded-full bg-primary" />
        </span>
      )
  }
}
