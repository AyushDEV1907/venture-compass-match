
-- Create storage bucket for pitch decks
INSERT INTO storage.buckets (id, name, public)
VALUES ('pitch-decks', 'pitch-decks', false);

-- Create storage policies for pitch decks
CREATE POLICY "Users can upload their own pitch decks"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pitch-decks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own pitch decks"
ON storage.objects FOR SELECT
USING (bucket_id = 'pitch-decks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own pitch decks"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pitch-decks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own pitch decks"
ON storage.objects FOR DELETE
USING (bucket_id = 'pitch-decks' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table to track pitch deck metadata
CREATE TABLE public.pitch_deck_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'uploading',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on pitch_deck_uploads
ALTER TABLE public.pitch_deck_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pitch_deck_uploads
CREATE POLICY "Users can view their own pitch deck uploads"
ON public.pitch_deck_uploads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pitch deck uploads"
ON public.pitch_deck_uploads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pitch deck uploads"
ON public.pitch_deck_uploads FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pitch deck uploads"
ON public.pitch_deck_uploads FOR DELETE
USING (auth.uid() = user_id);

-- Add pitch_deck_url column to startups table
ALTER TABLE public.startups ADD COLUMN pitch_deck_url TEXT;
