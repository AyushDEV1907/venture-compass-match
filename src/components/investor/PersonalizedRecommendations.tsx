import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, TrendingUp, Users, Eye, MessageSquare, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";
import StartupProfileModal from "@/components/StartupProfileModal";
import ChatModal from "@/components/ChatModal";
import { StartupData } from "@/types";

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getMatchScore = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Potential Match';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasPreferences) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Set Your Investment Preferences
          </CardTitle>
          <CardDescription>
            Configure your investment criteria to receive personalized startup recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Preferences Set</h3>
          <p className="text-muted-foreground mb-4">
            Set your investment preferences to get AI-powered startup recommendations
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            Set Preferences
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-6 h-6" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            AI-curated startup matches based on your investment preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recommendations Available</h3>
              <p className="text-muted-foreground">
                We're working on finding startups that match your criteria. Check back soon!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{recommendations.length} Recommendations</h3>
                <p className="text-muted-foreground">
                  Ranked by match score and fundability
                </p>
              </div>
              <Button variant="outline" onClick={loadRecommendations}>
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      {recommendations.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => {
            const startup = startupDetails[recommendation.startup_id];
            if (!startup) return null;

            return (
              <Card key={recommendation.startup_id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-lg">
                        {startup.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold">{startup.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {startup.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(recommendation.fundability_score)}`}>
                        {recommendation.fundability_score}/100
                      </div>
                      <div className="text-xs text-muted-foreground">Fundability</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {startup.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {startup.sector}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {startup.stage}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Team:</span> {startup.team_size}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target:</span> {startup.funding_target}
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Match Score</span>
                      <span className="text-sm text-blue-600 font-medium">
                        {getMatchScore(recommendation.recommendation_score)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                          style={{ width: `${Math.min(recommendation.recommendation_score, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(recommendation.recommendation_score)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewProfile(recommendation)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleMessage(recommendation)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
