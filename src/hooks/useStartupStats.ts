
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';

interface StartupStats {
  profile_views: number;
  investor_matches: number;
  messages: number;
  pitch_views: number;
}

export const useStartupStats = () => {
  const [stats, setStats] = useState<StartupStats | null>(null);
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
      const { data, error } = await supabase.rpc('get_startup_stats', {
        startup_user_id: user.id
      });

      if (error) {
        console.error('Error fetching startup stats:', error);
        setError(error.message);
        return;
      }

      // Parse the JSON data and cast to StartupStats
      const parsedStats = typeof data === 'string' ? JSON.parse(data) : data;
      setStats(parsedStats as StartupStats);
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
