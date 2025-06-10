
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWatchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadWatchlist = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return;

      const { data, error } = await supabase
        .from('watchlists')
        .select(`
          id,
          created_at,
          startup:startup_id (
            id,
            user_id,
            name,
            description,
            sector,
            stage,
            location,
            logo,
            funding_target,
            team_size,
            revenue,
            traction
          ),
          investor:investor_id (
            id,
            user_id,
            name,
            description,
            sectors,
            stages,
            ticket_size,
            location,
            portfolio,
            logo
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlistItems(data || []);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to load watchlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = async (itemId: string, type: 'startup' | 'investor') => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const insertData: any = {
        user_id: user.id,
      };

      if (type === 'startup') {
        insertData.startup_id = itemId;
      } else {
        insertData.investor_id = itemId;
      }

      const { error } = await supabase
        .from('watchlists')
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Added to watchlist",
        description: `${type} has been added to your watchlist`,
      });

      loadWatchlist();
    } catch (error: any) {
      console.error('Error adding to watchlist:', error);
      if (error.code === '23505') {
        toast({
          title: "Already in watchlist",
          description: "This item is already in your watchlist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to watchlist",
          variant: "destructive",
        });
      }
    }
  };

  const removeFromWatchlist = async (itemId: string, type: 'startup' | 'investor') => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const deleteCondition: any = { user_id: user.id };
      
      if (type === 'startup') {
        deleteCondition.startup_id = itemId;
      } else {
        deleteCondition.investor_id = itemId;
      }

      const { error } = await supabase
        .from('watchlists')
        .delete()
        .match(deleteCondition);

      if (error) throw error;

      toast({
        title: "Removed from watchlist",
        description: "Item has been removed from your watchlist",
      });

      loadWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      });
    }
  };

  const isInWatchlist = (itemId: string, type: 'startup' | 'investor') => {
    return watchlistItems.some(item => {
      if (type === 'startup' && item.startup) {
        return item.startup.id === itemId;
      } else if (type === 'investor' && item.investor) {
        return item.investor.id === itemId;
      }
      return false;
    });
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  return {
    watchlistItems,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    loadWatchlist
  };
};
