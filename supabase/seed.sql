-- ============================================================
-- Profiles (instructors + demo learner)
-- ============================================================
insert into public.profiles (id, name, avatar_url, role, company, onboarding_completed, streak_days, certificates_earned, total_lessons_completed) values
  ('seed-instructor-1', 'Alex Rivera',    'https://i.pravatar.cc/150?u=alex',   'Senior Design Lead', 'ScreenFlow',  true, 0, 0, 0),
  ('seed-instructor-2', 'Sarah Chen',     'https://i.pravatar.cc/150?u=sarah',  'Staff Engineer',     'Supabase',    true, 0, 0, 0),
  ('seed-instructor-3', 'Marcus Johnson', 'https://i.pravatar.cc/150?u=marcus', 'CS Professor',       'MIT',         true, 0, 0, 0);

-- ============================================================
-- Courses
-- ============================================================
insert into public.courses (id, title, description, image_url, price, original_price, is_published, category, instructor_id, rating, review_count, total_duration, lesson_count) values
  ('c1000000-0000-0000-0000-000000000001', 'Introduction to React Native',
   'Learn the fundamentals of building mobile apps with React Native. Covers components, styling, navigation, and platform-specific APIs.',
   'https://picsum.photos/seed/react-native/800/400',
   4999, 9999, true, 'Coding', 'seed-instructor-1',
   4.8, 1240, 46800, 18),

  ('c1000000-0000-0000-0000-000000000002', 'Advanced TypeScript Patterns',
   'Deep dive into TypeScript generics, conditional types, mapped types, and real-world patterns for large-scale applications.',
   'https://picsum.photos/seed/typescript/800/400',
   7999, 12000, true, 'Coding', 'seed-instructor-1',
   4.9, 2400, 66600, 42),

  ('c1000000-0000-0000-0000-000000000003', 'Supabase & PostgreSQL Masterclass',
   'Build full-stack apps with Supabase. Covers database design, Row Level Security, Edge Functions, and real-time subscriptions.',
   'https://picsum.photos/seed/supabase/800/400',
   5999, null, true, 'Coding', 'seed-instructor-2',
   4.7, 890, 54000, 24),

  ('c1000000-0000-0000-0000-000000000004', 'UI/UX Design for Developers',
   'Practical design principles every developer should know. Typography, color theory, layout, and building consistent design systems.',
   'https://picsum.photos/seed/design/800/400',
   3999, 7999, true, 'Design', 'seed-instructor-2',
   4.6, 650, 36000, 16),

  ('c1000000-0000-0000-0000-000000000005', 'Expo from Zero to App Store',
   'Ship a production app to both app stores. Covers EAS Build, OTA updates, push notifications, and App Store review guidelines.',
   'https://picsum.photos/seed/expo/800/400',
   8999, 14999, true, 'Coding', 'seed-instructor-1',
   4.9, 3200, 72000, 36),

  ('c1000000-0000-0000-0000-000000000006', 'Data Structures & Algorithms',
   'Master the CS fundamentals that power technical interviews. Arrays, trees, graphs, dynamic programming, and complexity analysis.',
   'https://picsum.photos/seed/algorithms/800/400',
   0, null, true, 'Coding', 'seed-instructor-3',
   4.5, 4100, 82800, 48),

  ('c1000000-0000-0000-0000-000000000007', 'Digital Marketing Fundamentals',
   'Learn SEO, content marketing, social media strategy, and paid advertising to grow any business online.',
   'https://picsum.photos/seed/marketing/800/400',
   3499, 6999, true, 'Marketing', 'seed-instructor-2',
   4.4, 520, 28800, 14),

  ('c1000000-0000-0000-0000-000000000008', 'Business Strategy for Startups',
   'From idea validation to fundraising. Covers business models, market analysis, financial planning, and pitch decks.',
   'https://picsum.photos/seed/business/800/400',
   5999, 9999, true, 'Business', 'seed-instructor-3',
   4.7, 780, 43200, 20);

-- ============================================================
-- Chapters
-- ============================================================
insert into public.chapters (id, course_id, title, sort_order) values
  -- React Native course
  ('c0100000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Getting Started with React Native', 1),
  ('c0100000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Core Components & Styling', 2),
  -- TypeScript course
  ('c0100000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Design System Fundamentals', 1),
  ('c0100000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Advanced Auto-Layout', 2),
  ('c0100000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'Variables & Tokens', 3),
  ('c0100000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Advanced Prototyping', 4),
  -- Design course
  ('c0100000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000004', 'Design Principles', 1),
  ('c0100000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000004', 'Typography & Color', 2);

-- ============================================================
-- Lessons
-- ============================================================
insert into public.lessons (id, chapter_id, title, description, duration, video_url, is_locked, sort_order) values
  -- React Native ch1
  ('1e100000-0000-0000-0000-000000000001', 'c0100000-0000-0000-0000-000000000001', 'Environment Setup',
   'Set up your development environment for React Native.',
   720, 'https://example.com/videos/rn-setup.mp4', false, 1),
  ('1e100000-0000-0000-0000-000000000002', 'c0100000-0000-0000-0000-000000000001', 'Your First App',
   'Create and run your first React Native application.',
   900, 'https://example.com/videos/rn-first.mp4', false, 2),
  -- React Native ch2
  ('1e100000-0000-0000-0000-000000000003', 'c0100000-0000-0000-0000-000000000002', 'View, Text, and Image',
   'Learn the fundamental building blocks of React Native.',
   660, 'https://example.com/videos/rn-core.mp4', true, 1),
  ('1e100000-0000-0000-0000-000000000004', 'c0100000-0000-0000-0000-000000000002', 'Flexbox Layout',
   'Master layout with flexbox in React Native.',
   840, 'https://example.com/videos/rn-flex.mp4', true, 2),
  -- TypeScript ch1
  ('1e100000-0000-0000-0000-000000000005', 'c0100000-0000-0000-0000-000000000003', 'Introduction to Systems',
   'Overview of design systems and why they matter.',
   525, 'https://example.com/videos/ts-intro.mp4', false, 1),
  ('1e100000-0000-0000-0000-000000000006', 'c0100000-0000-0000-0000-000000000003', 'Typography Architecture',
   'Building scalable typography systems in Figma.',
   740, 'https://example.com/videos/ts-typo.mp4', true, 2),
  -- TypeScript ch2
  ('1e100000-0000-0000-0000-000000000007', 'c0100000-0000-0000-0000-000000000004', 'Nested Auto-Layout',
   'Working with nested auto-layout frames.',
   615, 'https://example.com/videos/ts-nested.mp4', true, 1),
  ('1e100000-0000-0000-0000-000000000008', 'c0100000-0000-0000-0000-000000000004', 'Responsive Frames',
   'Creating truly responsive design components.',
   870, 'https://example.com/videos/ts-resp.mp4', true, 2),
  -- TypeScript ch3
  ('1e100000-0000-0000-0000-000000000009', 'c0100000-0000-0000-0000-000000000005', 'Color Variables',
   'Setting up color variables and modes.',
   540, 'https://example.com/videos/ts-color.mp4', true, 1),
  ('1e100000-0000-0000-0000-000000000010', 'c0100000-0000-0000-0000-000000000005', 'Spacing Tokens',
   'Implementing consistent spacing tokens.',
   700, 'https://example.com/videos/ts-space.mp4', true, 2),
  -- TypeScript ch4
  ('1e100000-0000-0000-0000-000000000011', 'c0100000-0000-0000-0000-000000000006', 'Smart Animate',
   'Creating fluid transitions with Smart Animate.',
   790, 'https://example.com/videos/ts-animate.mp4', true, 1),
  ('1e100000-0000-0000-0000-000000000012', 'c0100000-0000-0000-0000-000000000006', 'Interactive Components',
   'Building interactive component variants.',
   900, 'https://example.com/videos/ts-interact.mp4', true, 2),
  -- Design ch1
  ('1e100000-0000-0000-0000-000000000013', 'c0100000-0000-0000-0000-000000000007', 'Visual Hierarchy',
   'Understanding visual hierarchy in UI design.',
   600, 'https://example.com/videos/design-hierarchy.mp4', false, 1),
  ('1e100000-0000-0000-0000-000000000014', 'c0100000-0000-0000-0000-000000000007', 'Gestalt Principles',
   'Applying Gestalt principles to interface design.',
   720, 'https://example.com/videos/design-gestalt.mp4', true, 2),
  -- Design ch2
  ('1e100000-0000-0000-0000-000000000015', 'c0100000-0000-0000-0000-000000000008', 'Type Scale Systems',
   'Creating modular type scale systems.',
   540, 'https://example.com/videos/design-type.mp4', true, 1),
  ('1e100000-0000-0000-0000-000000000016', 'c0100000-0000-0000-0000-000000000008', 'Color Theory for UI',
   'Practical color theory for digital interfaces.',
   660, 'https://example.com/videos/design-color.mp4', true, 2);

-- ============================================================
-- Lesson resources
-- ============================================================
insert into public.lesson_resources (lesson_id, file_name, file_size, file_type, download_url, sort_order) values
  ('1e100000-0000-0000-0000-000000000006', 'Typography_Scale.fig', 1468006, 'Figma File', 'https://example.com/files/typography-scale.fig', 1),
  ('1e100000-0000-0000-0000-000000000009', 'Color_Tokens.fig',    892400,  'Figma File', 'https://example.com/files/color-tokens.fig',     1),
  ('1e100000-0000-0000-0000-000000000001', 'Setup_Guide.pdf',     245000,  'PDF',        'https://example.com/files/setup-guide.pdf',      1);
