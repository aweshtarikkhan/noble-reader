
-- Create a public storage bucket for hadith JSON data
INSERT INTO storage.buckets (id, name, public)
VALUES ('hadith-data', 'hadith-data', true);

-- Allow public read access to hadith data
CREATE POLICY "Hadith data is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'hadith-data');

-- Allow service role to upload hadith data (via edge function)
CREATE POLICY "Service role can upload hadith data"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hadith-data');

CREATE POLICY "Service role can update hadith data"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hadith-data');
