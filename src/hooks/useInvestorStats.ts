
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';

interface InvestorStats {
  startups_reviewed: number;
  interested_matches: number;
  active_conversations: number;
  deals_in_pipeline: number;
}

export const useInvestorStats = () => {
  const [stats, setStats] = useState<InvestorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_investor_stats', {
        investor_user_id: user.id
      });

      if (error) {
        console.error('Error fetching investor stats:', error);
        setError(error.message);
        return;
      }

      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error in fetchStats:', err);
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return { stats, loading, error, refetch: fetchStats };
};
