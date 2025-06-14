
-- Create tables for fundability scoring and guided improvement
CREATE TABLE public.fundability_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  market_potential_score INTEGER NOT NULL CHECK (market_potential_score >= 0 AND market_potential_score <= 100),
  value_proposition_score INTEGER NOT NULL CHECK (value_proposition_score >= 0 AND value_proposition_score <= 100),
  team_score INTEGER NOT NULL CHECK (team_score >= 0 AND team_score <= 100),
  business_model_score INTEGER NOT NULL CHECK (business_model_score >= 0 AND business_model_score <= 100),
  traction_score INTEGER NOT NULL CHECK (traction_score >= 0 AND traction_score <= 100),
  exit_potential_score INTEGER NOT NULL CHECK (exit_potential_score >= 0 AND exit_potential_score <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'improvement', 'rejected', 'pending')),
  feedback JSONB,
  improvement_areas TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for improvement tracking
CREATE TABLE public.startup_improvements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  fundability_score_id UUID REFERENCES public.fundability_scores(id) ON DELETE CASCADE,
  improvement_type TEXT NOT NULL CHECK (improvement_type IN ('pitch_deck', 'financial_model', 'team_building', 'market_analysis', 'business_model')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  resources_used TEXT[],
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for quarterly check-ins
CREATE TABLE public.startup_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL,
  year INTEGER NOT NULL,
  revenue_growth DECIMAL,
  user_growth DECIMAL,
  team_changes INTEGER DEFAULT 0,
  funding_raised DECIMAL,
  new_partnerships INTEGER DEFAULT 0,
  product_updates TEXT,
  challenges TEXT,
  goals_next_quarter TEXT,
  rescoring_needed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for investor explicit preferences
CREATE TABLE public.investor_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES public.investors(id) ON DELETE CASCADE,
  preferred_sectors TEXT[] DEFAULT '{}',
  preferred_stages TEXT[] DEFAULT '{}',
  min_check_size DECIMAL,
  max_check_size DECIMAL,
  preferred_geographies TEXT[] DEFAULT '{}',
  risk_appetite TEXT CHECK (risk_appetite IN ('low', 'medium', 'high')),
  investment_thesis TEXT,
  exclusion_criteria TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for startup feature vectors (for ML recommendations)
CREATE TABLE public.startup_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  fundability_score INTEGER,
  market_size_score DECIMAL,
  competition_score DECIMAL,
  team_experience_score DECIMAL,
  product_readiness_score DECIMAL,
  financial_health_score DECIMAL,
  feature_vector JSONB, -- Store all feature data including text embeddings as JSON
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for recommendation tracking
CREATE TABLE public.recommendation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES public.investors(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  recommendation_score DECIMAL NOT NULL,
  algorithm_version TEXT DEFAULT 'v1.0',
  features_used JSONB,
  shown_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP WITH TIME ZONE,
  interested BOOLEAN DEFAULT false,
  interested_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE public.fundability_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for fundability_scores
CREATE POLICY "Users can view their startup's fundability scores" ON public.fundability_scores
  FOR SELECT USING (
    startup_id IN (SELECT id FROM public.startups WHERE user_id = auth.uid())
  );

CREATE POLICY "Investors can view approved startup scores" ON public.fundability_scores
  FOR SELECT USING (
    status = 'approved' AND 
    EXISTS (SELECT 1 FROM public.investors WHERE user_id = auth.uid())
  );

-- RLS policies for startup_improvements
CREATE POLICY "Users can manage their startup improvements" ON public.startup_improvements
  FOR ALL USING (
    startup_id IN (SELECT id FROM public.startups WHERE user_id = auth.uid())
  );

-- RLS policies for startup_checkins
CREATE POLICY "Users can manage their startup checkins" ON public.startup_checkins
  FOR ALL USING (
    startup_id IN (SELECT id FROM public.startups WHERE user_id = auth.uid())
  );

-- RLS policies for investor_preferences
CREATE POLICY "Investors can manage their preferences" ON public.investor_preferences
  FOR ALL USING (
    investor_id IN (SELECT id FROM public.investors WHERE user_id = auth.uid())
  );

-- RLS policies for startup_features
CREATE POLICY "Startup features viewable by investors and owners" ON public.startup_features
  FOR SELECT USING (
    startup_id IN (SELECT id FROM public.startups WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.investors WHERE user_id = auth.uid())
  );

-- RLS policies for recommendation_logs
CREATE POLICY "Investors can view their recommendation logs" ON public.recommendation_logs
  FOR ALL USING (
    investor_id IN (SELECT id FROM public.investors WHERE user_id = auth.uid())
  );

-- Create function to calculate fundability score
CREATE OR REPLACE FUNCTION public.calculate_fundability_score(
  market_potential INTEGER,
  value_proposition INTEGER,
  team INTEGER,
  business_model INTEGER,
  traction INTEGER,
  exit_potential INTEGER
) RETURNS INTEGER AS $$
BEGIN
  RETURN ROUND(
    (market_potential * 0.25) +
    (value_proposition * 0.20) +
    (team * 0.15) +
    (business_model * 0.15) +
    (traction * 0.15) +
    (exit_potential * 0.10)
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get personalized startup recommendations
CREATE OR REPLACE FUNCTION public.get_startup_recommendations(
  p_investor_id UUID,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  startup_id UUID,
  startup_name TEXT,
  fundability_score INTEGER,
  recommendation_score DECIMAL,
  sector TEXT,
  stage TEXT,
  location TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH investor_prefs AS (
    SELECT * FROM public.investor_preferences 
    WHERE investor_id = p_investor_id
    LIMIT 1
  ),
  scored_startups AS (
    SELECT 
      s.id,
      s.name,
      fs.score as fundability_score,
      s.sector,
      s.stage,
      s.location,
      -- Simple scoring based on preferences match
      CASE 
        WHEN ip.preferred_sectors IS NULL OR s.sector = ANY(ip.preferred_sectors) THEN 20 ELSE 0
      END +
      CASE 
        WHEN ip.preferred_stages IS NULL OR s.stage = ANY(ip.preferred_stages) THEN 15 ELSE 0
      END +
      CASE 
        WHEN ip.preferred_geographies IS NULL OR s.location = ANY(ip.preferred_geographies) THEN 10 ELSE 0
      END +
      (fs.score * 0.5) as calc_recommendation_score
    FROM public.startups s
    JOIN public.fundability_scores fs ON s.id = fs.startup_id
    CROSS JOIN investor_prefs ip
    WHERE fs.status = 'approved'
    AND fs.score >= 70
  )
  SELECT 
    ss.id,
    ss.name,
    ss.fundability_score,
    ss.calc_recommendation_score,
    ss.sector,
    ss.stage,
    ss.location
  FROM scored_startups ss
  ORDER BY ss.calc_recommendation_score DESC, ss.fundability_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
