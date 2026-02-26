-- Enhanced schema for complete LMS system with Neon
-- This migration adds course review workflow, instructors, and video support

-- Add instructor role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin', 'super_admin'));

-- Enhance courses table with status and approval workflow
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'rejected'));
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS review_notes TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Add video and resource support to lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_embed_code TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS resource_url TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;

-- Enhance enrollments with status
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS enrollment_status TEXT DEFAULT 'active' CHECK (enrollment_status IN ('pending', 'active', 'completed', 'dropped'));

-- Enhance lesson_progress with timestamps
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW();

-- Create course_reviews table for approval history
CREATE TABLE IF NOT EXISTS public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  reviewed_by UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected')),
  notes TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_admin" ON public.course_reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "reviews_insert_admin" ON public.course_reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Create course_modules table (if not using modules table above)
-- This ensures we have proper structure for course organization

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
