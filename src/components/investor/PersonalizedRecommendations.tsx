
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";
import StartupProfileModal from "@/components/StartupProfileModal";
import ChatModal from "@/components/ChatModal";
import { StartupData } from "@/types";
import RecommendationCard from "./RecommendationCard";
import RecommendationHeader from "./RecommendationHeader";
import PreferencesPrompt from "./PreferencesPrompt";
import LoadingState from "./LoadingState";

interface Recommendation {
  startup_id: string;
  startup_name: string;
  fundability_score: number;
  recommendation_score: number;
  sector: string;
  stage: string;
  location: string;
}

interface StartupDetail {
  id: string;
  name: string;
  description: string;
  sector: string;
  stage: string;
  location: string;
  logo: string;
  funding_target: string;
  team_size: string;
  revenue: string;
  traction: string;
  user_id: string;
}

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [startupDetails, setStartupDetails] = useState<Record<string, StartupDetail>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<StartupData | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Utility function to convert StartupDetail to StartupData
  const convertToStartupData = (startupDetail: StartupDetail): StartupData => {
    return {
      id: startupDetail.id,
      name: startupDetail.name,
      description: startupDetail.description,
      sector: startupDetail.sector,
      stage: startupDetail.stage,
      fundingTarget: startupDetail.funding_target,
      location: startupDetail.location,
      teamSize: startupDetail.team_size,
      revenue: startupDetail.revenue,
      traction: startupDetail.traction,
      logo: startupDetail.logo,
    };
  };

  useEffect(() => {
    if (user) {
      checkPreferences();
      loadRecommendations();
    }
  }, [user]);

  const checkPreferences = async () => {
    try {
      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (investorError) throw investorError;

      const { data: preferences, error } = await supabase
        .from('investor_preferences')
        .select('id')
        .eq('investor_id', investor.id)
        .single();

      setHasPreferences(!!preferences);
    } catch (error) {
      console.error('Error checking preferences:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
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

      // Load detailed startup information
      if (data && data.length > 0) {
        const startupIds = data.map((rec: Recommendation) => rec.startup_id);
        const { data: startups, error: startupsError } = await supabase
          .from('startups')
          .select('*')
          .in('id', startupIds);

        if (startupsError) throw startupsError;

        const startupMap = startups.reduce((acc, startup) => {
          acc[startup.id] = startup;
          return acc;
        }, {} as Record<string, StartupDetail>);

        setStartupDetails(startupMap);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logRecommendationView = async (startupId: string, recommendationScore: number) => {
    try {
      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (investorError) throw investorError;

      await supabase
        .from('recommendation_logs')
        .insert({
          investor_id: investor.id,
          startup_id: startupId,
          recommendation_score: recommendationScore,
          clicked: true,
          clicked_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging recommendation view:', error);
    }
  };

  const logInterested = async (startupId: string, recommendationScore: number) => {
    try {
      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (investorError) throw investorError;

      await supabase
        .from('recommendation_logs')
        .insert({
          investor_id: investor.id,
          startup_id: startupId,
          recommendation_score: recommendationScore,
          interested: true,
          interested_at: new Date().toISOString()
        });

      // Create a match
      await supabase
        .from('matches')
        .insert({
          initiator_id: user!.id,
          target_id: startupDetails[startupId]?.user_id,
          investor_id: investor.id,
          startup_id: startupId,
          status: 'pending'
        });

      toast({
        title: "Interest Expressed",
        description: "Your interest has been sent to the startup",
      });
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: "Error",
        description: "Failed to express interest",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (recommendation: Recommendation) => {
    const startup = startupDetails[recommendation.startup_id];
    if (startup) {
      setSelectedStartup(convertToStartupData(startup));
      setShowProfile(true);
      logRecommendationView(recommendation.startup_id, recommendation.recommendation_score);
    }
  };

  const handleMessage = (recommendation: Recommendation) => {
    const startup = startupDetails[recommendation.startup_id];
    if (startup) {
      setSelectedStartup(convertToStartupData(startup));
      setShowChat(true);
      logInterested(recommendation.startup_id, recommendation.recommendation_score);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!hasPreferences) {
    return <PreferencesPrompt />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <RecommendationHeader 
        recommendationsCount={recommendations.length}
        onRefresh={loadRecommendations}
      />

      {/* Recommendations Grid */}
      {recommendations.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => {
            const startup = startupDetails[recommendation.startup_id];
            if (!startup) return null;

            return (
              <RecommendationCard
                key={recommendation.startup_id}
                recommendation={recommendation}
                startup={startup}
                onViewProfile={handleViewProfile}
                onMessage={handleMessage}
              />
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedStartup && (
        <>
          <StartupProfileModal
            startup={selectedStartup}
            isOpen={showProfile}
            onClose={() => {
              setShowProfile(false);
              setSelectedStartup(null);
            }}
            onMessage={() => {
              setShowProfile(false);
              setShowChat(true);
            }}
          />
          <ChatModal
            recipient={selectedStartup}
            isOpen={showChat}
            onClose={() => {
              setShowChat(false);
              setSelectedStartup(null);
            }}
          />
        </>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
