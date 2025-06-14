
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';

interface FundabilityScore {
  id: string;
  score: number;
  status: string;
  created_at: string;
  market_potential_score: number;
  value_proposition_score: number;
  team_score: number;
  business_model_score: number;
  traction_score: number;
  exit_potential_score: number;
  improvement_areas: string[];
}

export const useFundabilityScore = () => {
  const [score, setScore] = useState<FundabilityScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLatestScore();
    }
  }, [user]);

  const fetchLatestScore = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (startupError) throw startupError;

      const { data, error } = await supabase
        .from('fundability_scores')
        .select('*')
        .eq('startup_id', startup.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setScore(data || null);
    } catch (err) {
      console.error('Error fetching fundability score:', err);
      setError('Failed to fetch fundability score');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    score,
    isLoading,
    error,
    refetch: fetchLatestScore
  };
};
