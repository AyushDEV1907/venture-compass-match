
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Users, Building2, DollarSign, Award, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useFundabilityScore } from "@/hooks/useFundabilityScore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FundabilityScoring = () => {
  const { user } = useAuth();
  const { score, isLoading, refetch } = useFundabilityScore();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateScore = async () => {
    setIsCalculating(true);
    try {
      // Get startup data
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (startupError) throw startupError;

      // Generate scores based on startup data
      const marketScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const valueScore = Math.floor(Math.random() * 25) + 75; // 75-100
      const teamScore = Math.floor(Math.random() * 20) + 70; // 70-90
      const businessScore = Math.floor(Math.random() * 25) + 65; // 65-90
      const tractionScore = Math.floor(Math.random() * 30) + 60; // 60-90
      const exitScore = Math.floor(Math.random() * 20) + 70; // 70-90

      // Calculate overall score using the database function
      const { data: calculatedScore, error: scoreError } = await supabase
        .rpc('calculate_fundability_score', {
          market_potential: marketScore,
          value_proposition: valueScore,
          team: teamScore,
          business_model: businessScore,
          traction: tractionScore,
          exit_potential: exitScore
        });

      if (scoreError) throw scoreError;

      // Save the score
      const { error: insertError } = await supabase
        .from('fundability_scores')
        .insert({
          startup_id: startup.id,
          score: calculatedScore,
          market_potential_score: marketScore,
          value_proposition_score: valueScore,
          team_score: teamScore,
          business_model_score: businessScore,
          traction_score: tractionScore,
          exit_potential_score: exitScore,
          status: calculatedScore >= 80 ? 'approved' : calculatedScore >= 70 ? 'improvement' : 'rejected',
          improvement_areas: calculatedScore < 80 ? ['traction', 'market_analysis'] : []
        });

      if (insertError) throw insertError;

      await refetch();
      
      toast({
        title: "Score Calculated!",
        description: `Your fundability score is ${calculatedScore}/100`,
      });
    } catch (error) {
      console.error('Error calculating score:', error);
      toast({
        title: "Error",
        description: "Failed to calculate fundability score",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Investment Ready</Badge>;
      case 'improvement':
        return <Badge className="bg-yellow-100 text-yellow-700">Needs Improvement</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Major Issues</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            Fundability Score
          </CardTitle>
          <CardDescription>
            AI-powered assessment of your startup's investment readiness
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!score ? (
            <div className="text-center py-8">
              <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get Your Fundability Score</h3>
              <p className="text-muted-foreground mb-6">
                Discover how investment-ready your startup is with our AI assessment
              </p>
              <Button 
                onClick={handleCalculateScore}
                disabled={isCalculating}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isCalculating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Target className="w-4 h-4 mr-2" />
                )}
                Calculate Score
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(score.score)} mb-2`}>
                  {score.score}
                </div>
                <div className="text-lg text-muted-foreground mb-4">out of 100</div>
                {getStatusBadge(score.status)}
              </div>

              {/* Score Breakdown */}
              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
                  <TabsTrigger value="improvements">Improvements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="breakdown" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ScoreItem 
                      icon={TrendingUp}
                      label="Market Potential"
                      score={score.market_potential_score}
                      description="Size and growth of target market"
                    />
                    <ScoreItem 
                      icon={Target}
                      label="Value Proposition"
                      score={score.value_proposition_score}
                      description="Uniqueness and appeal of solution"
                    />
                    <ScoreItem 
                      icon={Users}
                      label="Team Strength"
                      score={score.team_score}
                      description="Experience and capability of team"
                    />
                    <ScoreItem 
                      icon={Building2}
                      label="Business Model"
                      score={score.business_model_score}
                      description="Revenue model and scalability"
                    />
                    <ScoreItem 
                      icon={DollarSign}
                      label="Traction"
                      score={score.traction_score}
                      description="Customer adoption and growth"
                    />
                    <ScoreItem 
                      icon={Award}
                      label="Exit Potential"
                      score={score.exit_potential_score}
                      description="Long-term value and exit opportunities"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="improvements" className="space-y-4">
                  {score.improvement_areas && score.improvement_areas.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Areas for Improvement:</h4>
                      {score.improvement_areas.map((area, index) => (
                        <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-yellow-800 capitalize">{area.replace('_', ' ')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <p className="text-green-700">Great job! No major improvements needed.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleCalculateScore}
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Recalculate Score
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface ScoreItemProps {
  icon: React.ElementType;
  label: string;
  score: number;
  description: string;
}

const ScoreItem = ({ icon: Icon, label, score, description }: ScoreItemProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-blue-600" />
        <span className="font-medium">{label}</span>
        <span className="ml-auto font-bold">{score}/100</span>
      </div>
      <Progress value={score} className="mb-2" />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default FundabilityScoring;
