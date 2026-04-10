-- Create a public storage bucket for course images
-- Public so images can be displayed without auth (thumbnails, marketing pages)
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-images', 'course-images', true);

-- Anyone can view course images
CREATE POLICY "Public read access for course images"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-images');

-- Only authenticated users (tutors) can upload course images
CREATE POLICY "Authenticated users can upload course images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-images');

-- Only authenticated users can update/replace their images
CREATE POLICY "Authenticated users can update course images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-images');
