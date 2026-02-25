'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BookOpen, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Lesson {
  id: string
  title: string
  content: string | null
  lesson_type: string
}

export function LessonViewer({
  lesson,
  onBack,
}: {
  lesson: Lesson
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" onClick={onBack} className="w-fit gap-2 text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {lesson.lesson_type === 'quiz' ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">Q</span>
            ) : lesson.lesson_type === 'flashcard' ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">F</span>
            ) : lesson.lesson_type === 'attachment' ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="h-5 w-5" />
              </span>
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </span>
            )}
            <div>
              <CardTitle className="text-xl text-card-foreground">{lesson.title}</CardTitle>
              <Badge variant="secondary" className="mt-1 capitalize text-xs">
                {lesson.lesson_type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {lesson.content ? (
            <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
              {lesson.content.split('\n').map((paragraph, i) => (
                <p key={i} className={paragraph.trim() === '' ? 'h-4' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No content available for this lesson yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
