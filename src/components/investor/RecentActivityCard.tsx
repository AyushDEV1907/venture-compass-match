
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthContext";
import { Calendar, Eye, MessageCircle, ThumbsUp, Handshake } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Activity {
  id: string;
  type: string;
  entity_name: string;
  created_at: string;
  color: string;
}

const RecentActivityCard = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecentActivities();
    }
  }, [user]);

  const fetchRecentActivities = async () => {
    try {
      setIsLoading(true);
      
      // Get investor ID first
      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('id')
        .eq('user_id', user!.id)
        .single();
      
      if (investorError) throw investorError;
      
      // Fetch multiple types of activities and combine them
      
      // 1. Get recommendation logs (clicks)
      const { data: viewLogs, error: viewError } = await supabase
        .from('recommendation_logs')
        .select('id, startup_id, clicked_at, startups:startup_id (name)')
        .eq('investor_id', investor.id)
        .eq('clicked', true)
        .order('clicked_at', { ascending: false })
        .limit(3);
      
      if (viewError) throw viewError;
      
      // 2. Get recommendation logs (interested)
      const { data: interestLogs, error: interestError } = await supabase
        .from('recommendation_logs')
        .select('id, startup_id, interested_at, startups:startup_id (name)')
        .eq('investor_id', investor.id)
        .eq('interested', true)
        .order('interested_at', { ascending: false })
        .limit(3);
      
      if (interestError) throw interestError;
      
      // 3. Get matches
      const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select('id, startup_id, created_at, status, startups:startup_id (name)')
        .eq('investor_id', investor.id)
        .eq('status', 'matched')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (matchError) throw matchError;

      // Combine and map all activities
      const combinedActivities: Activity[] = [
        ...(viewLogs || []).map(log => ({
          id: log.id,
          type: 'view',
          entity_name: log.startups?.name || 'Unknown startup',
          created_at: log.clicked_at,
          color: 'blue'
        })),
        ...(interestLogs || []).map(log => ({
          id: log.id,
          type: 'interest',
          entity_name: log.startups?.name || 'Unknown startup',
          created_at: log.interested_at,
          color: 'green'
        })),
        ...(matches || []).map(match => ({
          id: match.id,
          type: 'match',
          entity_name: match.startups?.name || 'Unknown startup',
          created_at: match.created_at,
          color: 'purple'
        }))
      ].sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      ).slice(0, 5);
      
      setActivities(combinedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'interest':
        return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'match':
        return <Handshake className="w-4 h-4 text-purple-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityText = (type: string, entity_name: string) => {
    switch (type) {
      case 'view':
        return `Viewed profile of ${entity_name}`;
      case 'interest':
        return `Expressed interest in ${entity_name}`;
      case 'match':
        return `Matched with ${entity_name}`;
      default:
        return `Activity with ${entity_name}`;
    }
  };

  const getActivityBackground = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50';
      case 'blue':
        return 'bg-blue-50';
      case 'purple':
        return 'bg-purple-50';
      case 'yellow':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  const formatActivityDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMM d, h:mm a');
    } catch (error) {
      return '';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-100 animate-pulse rounded-lg h-12"
              ></div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          activities.map(activity => (
            <div 
              key={activity.id} 
              className={`flex items-center gap-3 p-3 ${getActivityBackground(activity.color)} rounded-lg`}
            >
              <div className="flex items-center gap-3 flex-1">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <span className="text-sm">{getActivityText(activity.type, activity.entity_name)}</span>
                  <div className="text-xs text-gray-500">{formatActivityDate(activity.created_at)}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <span className="text-sm text-gray-500">No recent activity</span>
          </div>
        )}
        
        {!isLoading && activities.length === 0 && (
          <div className="flex items-center justify-center p-4">
            <MessageCircle className="mr-2 w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Start exploring startups to see activity here</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
