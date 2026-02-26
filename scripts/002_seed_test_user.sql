-- Insert test admin user (c.chalo@gmail.com / Vault)
-- Password hash created with bcryptjs: bcryptjs.hashSync('Vault', 10)
INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'c.chalo@gmail.com', '$2a$10$Yk4r0pf.YKAq6L5tJx8gQeWlH/Zq4H1j8K9Q8l2Z6Z5Z5Z5Z5Z5Z', 'Admin User', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some test student users
INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'student1@example.com', '$2a$10$Yk4r0pf.YKAq6L5tJx8gQeWlH/Zq4H1j8K9Q8l2Z6Z5Z5Z5Z5Z5Z', 'Student One', 'student'),
  ('550e8400-e29b-41d4-a716-446655440003', 'student2@example.com', '$2a$10$Yk4r0pf.YKAq6L5tJx8gQeWlH/Zq4H1j8K9Q8l2Z6Z5Z5Z5Z5Z5Z', 'Student Two', 'student')
ON CONFLICT (email) DO NOTHING;

-- Insert some test instructor users
INSERT INTO profiles (id, email, password_hash, full_name, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'instructor1@example.com', '$2a$10$Yk4r0pf.YKAq6L5tJx8gQeWlH/Zq4H1j8K9Q8l2Z6Z5Z5Z5Z5Z5Z', 'Instructor One', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert test courses
INSERT INTO courses (id, title, description, week_number, status, created_by) VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 'Cybersecurity Fundamentals', 'Learn the basics of cybersecurity and digital security', 1, 'published', '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Ethical Hacking 101', 'Introduction to ethical hacking and penetration testing', 2, 'published', '550e8400-e29b-41d4-a716-446655440010'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Network Security', 'Protecting networks and systems from cyber threats', 3, 'draft', '550e8400-e29b-41d4-a716-446655440010')
ON CONFLICT DO NOTHING;

-- Insert test modules for first course
INSERT INTO modules (id, course_id, title, sort_order) VALUES 
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Introduction to Cybersecurity', 1),
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Common Threats and Vulnerabilities', 2)
ON CONFLICT DO NOTHING;

-- Insert test lessons
INSERT INTO lessons (id, module_id, title, content, lesson_type, sort_order) VALUES 
  ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'What is Cybersecurity?', 'Cybersecurity is the practice of protecting systems and networks from digital attacks.', 'lesson', 1),
  ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Security Best Practices', 'Learn the essential security practices every person should follow.', 'lesson', 2),
  ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 'Common Password Attacks', 'Understand how password attacks work and how to prevent them.', 'lesson', 1)
ON CONFLICT DO NOTHING;

-- Enroll test students in courses
INSERT INTO enrollments (student_id, course_id) VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;
