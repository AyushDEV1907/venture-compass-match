
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';

interface Recommendation {
  startup_id: string;
  startup_name: string;
  fundability_score: number;
  recommendation_score: number;
  sector: string;
  stage: string;
  location: string;
}

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (user && userProfile?.user_type === 'investor') {
      fetchRecommendations();
    }
  }, [user, userProfile]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (investorError) throw investorError;

      const { data, error } = await supabase
        .rpc('get_startup_recommendations', {
          p_investor_id: investor.id,
          p_limit: 20
        });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to fetch recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recommendations,
    isLoading,
    error,
    refetch: fetchRecommendations
  };
};
