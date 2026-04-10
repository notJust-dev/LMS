-- Create a private storage bucket for lesson videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-videos', 'lesson-videos', false);

-- Only authenticated users can read (download/stream) videos
CREATE POLICY "Authenticated users can read lesson videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'lesson-videos');

-- Only authenticated users can upload lesson videos
CREATE POLICY "Authenticated users can upload lesson videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lesson-videos');
