-- Fix RLS policies for Supabase Storage buckets
-- Run this SQL in Supabase SQL Editor to allow authenticated users to upload files

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload to carrossel" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to investimentos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to config" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read carrossel" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read investimentos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read config" ON storage.objects;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all buckets
CREATE POLICY "Allow public read carrossel" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'carrossel');

CREATE POLICY "Allow public read investimentos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'investimentos');

CREATE POLICY "Allow public read config" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'config');

-- Allow authenticated users to upload to carrossel bucket
CREATE POLICY "Allow authenticated users to upload to carrossel" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'carrossel'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update files in carrossel bucket
CREATE POLICY "Allow authenticated users to update carrossel" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'carrossel'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete files in carrossel bucket
CREATE POLICY "Allow authenticated users to delete carrossel" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'carrossel'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to upload to investimentos bucket
CREATE POLICY "Allow authenticated users to upload to investimentos" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'investimentos'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update files in investimentos bucket
CREATE POLICY "Allow authenticated users to update investimentos" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'investimentos'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete files in investimentos bucket
CREATE POLICY "Allow authenticated users to delete investimentos" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'investimentos'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to upload to config bucket
CREATE POLICY "Allow authenticated users to upload to config" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'config'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update files in config bucket
CREATE POLICY "Allow authenticated users to update config" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'config'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete files in config bucket
CREATE POLICY "Allow authenticated users to delete config" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'config'
    AND auth.role() = 'authenticated'
  );
