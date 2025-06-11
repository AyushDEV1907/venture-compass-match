
-- Create table to track startup profile views
CREATE TABLE public.startup_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to track investor interactions (swipes, interests)
CREATE TABLE public.investor_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'interested', 'not_interested', 'superlike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to track pitch deck views
CREATE TABLE public.pitch_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.startup_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_views ENABLE ROW LEVEL SECURITY;

-- RLS policies for startup_views
CREATE POLICY "Users can view startup views related to them" 
  ON public.startup_views 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.startups s 
      WHERE s.id = startup_id AND s.user_id = auth.uid()
    ) OR viewer_id = auth.uid()
  );

CREATE POLICY "Users can insert startup views" 
  ON public.startup_views 
  FOR INSERT 
  WITH CHECK (viewer_id = auth.uid());

-- RLS policies for investor_interactions
CREATE POLICY "Investors can view their own interactions" 
  ON public.investor_interactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.investors i 
      WHERE i.id = investor_id AND i.user_id = auth.uid()
    )
  );

CREATE POLICY "Investors can insert their own interactions" 
  ON public.investor_interactions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.investors i 
      WHERE i.id = investor_id AND i.user_id = auth.uid()
    )
  );

-- RLS policies for pitch_views
CREATE POLICY "Users can view pitch views related to them" 
  ON public.pitch_views 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.startups s 
      WHERE s.id = startup_id AND s.user_id = auth.uid()
    ) OR viewer_id = auth.uid()
  );

CREATE POLICY "Users can insert pitch views" 
  ON public.pitch_views 
  FOR INSERT 
  WITH CHECK (viewer_id = auth.uid());

-- Create function to get startup dashboard stats
CREATE OR REPLACE FUNCTION public.get_startup_stats(startup_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSON;
  startup_record public.startups%ROWTYPE;
BEGIN
  -- Get the startup record for this user
  SELECT * INTO startup_record 
  FROM public.startups 
  WHERE user_id = startup_user_id;
  
  IF startup_record.id IS NULL THEN
    RETURN '{"profile_views": 0, "investor_matches": 0, "messages": 0, "pitch_views": 0}'::JSON;
  END IF;
  
  SELECT JSON_BUILD_OBJECT(
    'profile_views', COALESCE(profile_views.count, 0),
    'investor_matches', COALESCE(matches.count, 0),
    'messages', COALESCE(messages.count, 0),
    'pitch_views', COALESCE(pitch_views.count, 0)
  ) INTO stats
  FROM (
    SELECT COUNT(DISTINCT viewer_id) as count
    FROM public.startup_views sv
    WHERE sv.startup_id = startup_record.id
      AND sv.created_at >= NOW() - INTERVAL '30 days'
  ) profile_views
  CROSS JOIN (
    SELECT COUNT(*) as count
    FROM public.matches m
    WHERE m.startup_id = startup_record.id
      AND m.status = 'matched'
  ) matches
  CROSS JOIN (
    SELECT COUNT(*) as count
    FROM public.messages msg
    WHERE msg.sender_id = startup_user_id
      AND msg.created_at >= NOW() - INTERVAL '30 days'
  ) messages
  CROSS JOIN (
    SELECT COUNT(*) as count
    FROM public.pitch_views pv
    WHERE pv.startup_id = startup_record.id
      AND pv.created_at >= NOW() - INTERVAL '30 days'
  ) pitch_views;
  
  RETURN stats;
END;
$$;

-- Create function to get investor dashboard stats
CREATE OR REPLACE FUNCTION public.get_investor_stats(investor_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSON;
  investor_record public.investors%ROWTYPE;
BEGIN
  -- Get the investor record for this user
  SELECT * INTO investor_record 
  FROM public.investors 
  WHERE user_id = investor_user_id;
  
  IF investor_record.id IS NULL THEN
    RETURN '{"startups_reviewed": 0, "interested_matches": 0, "active_conversations": 0, "deals_in_pipeline": 0}'::JSON;
  END IF;
  
  SELECT JSON_BUILD_OBJECT(
    'startups_reviewed', COALESCE(reviewed.count, 0),
    'interested_matches', COALESCE(matches.count, 0),
    'active_conversations', COALESCE(conversations.count, 0),
    'deals_in_pipeline', COALESCE(pipeline.count, 0)
  ) INTO stats
  FROM (
    SELECT COUNT(*) as count
    FROM public.investor_interactions ii
    WHERE ii.investor_id = investor_record.id
      AND ii.created_at >= NOW() - INTERVAL '30 days'
  ) reviewed
  CROSS JOIN (
    SELECT COUNT(*) as count
    FROM public.matches m
    WHERE m.investor_id = investor_record.id
      AND m.status = 'matched'
  ) matches
  CROSS JOIN (
    SELECT COUNT(DISTINCT c.id) as count
    FROM public.conversations c
    JOIN public.messages msg ON msg.conversation_id = c.id
    WHERE (c.participant1_id = investor_user_id OR c.participant2_id = investor_user_id)
      AND msg.created_at >= NOW() - INTERVAL '7 days'
  ) conversations
  CROSS JOIN (
    SELECT COUNT(*) as count
    FROM public.matches m
    WHERE m.investor_id = investor_record.id
      AND m.status = 'matched'
      AND m.created_at >= NOW() - INTERVAL '90 days'
  ) pipeline;
  
  RETURN stats;
END;
$$;
