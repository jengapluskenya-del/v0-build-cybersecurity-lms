-- Seed test data for LMS system
-- This script creates test users and sample data

-- Test user credentials:
-- Admin: c.chalo@gmail.com / password: Vault
-- The password should be hashed when inserted into the database

-- Create test users in profiles table (manually set UUIDs for testing)
-- NOTE: In production, users should be created through Supabase Auth
-- For development/testing, we use hardcoded UUIDs

-- Test admin user profile
-- Email: c.chalo@gmail.com
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'c.chalo@gmail.com',
  'Admin User',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Test student user profiles
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'student1@example.com',
  'Student One',
  'student'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'student2@example.com',
  'Student Two',
  'student'
)
ON CONFLICT (id) DO NOTHING;

-- Test instructor user profile
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'instructor@example.com',
  'Test Instructor',
  'instructor'
)
ON CONFLICT (id) DO NOTHING;
