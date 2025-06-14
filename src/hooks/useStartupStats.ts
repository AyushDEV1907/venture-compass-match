
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
  const [stats, setStats] = useState<StartupStats>({
    profile_views: 0,
    investor_matches: 0,
    messages: 0,
    pitch_views: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.log('useStartupStats: No user, setting loading to false');
      setLoading(false);
      return;
    }

    console.log('useStartupStats: Fetching stats for user:', user.id);
    
    const fetchStats = async () => {
      try {
        setError(null);
        
        const { data, error: rpcError } = await supabase
          .rpc('get_startup_stats', { startup_user_id: user.id });

        if (rpcError) {
          console.error('useStartupStats: RPC error:', rpcError);
          setError('Failed to fetch startup stats');
        } else {
          console.log('useStartupStats: Stats fetched successfully:', data);
          
          // Type-safe handling of the returned data
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            const typedStats: StartupStats = {
              profile_views: Number(data.profile_views) || 0,
              investor_matches: Number(data.investor_matches) || 0,
              messages: Number(data.messages) || 0,
              pitch_views: Number(data.pitch_views) || 0
            };
            setStats(typedStats);
          } else {
            // Fallback to default stats if data is not in expected format
            setStats({
              profile_views: 0,
              investor_matches: 0,
              messages: 0,
              pitch_views: 0
            });
          }
        }
      } catch (err) {
        console.error('useStartupStats: Exception:', err);
        setError('An error occurred while fetching stats');
      } finally {
        console.log('useStartupStats: Setting loading to false');
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading, error };
};
