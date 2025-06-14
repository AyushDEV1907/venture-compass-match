
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, TrendingUp, Target, Users, DollarSign, Lightbulb, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";

interface FundabilityScore {
  id: string;
  score: number;
  market_potential_score: number;
  value_proposition_score: number;
  team_score: number;
  business_model_score: number;
  traction_score: number;
  exit_potential_score: number;
  status: string;
  feedback: any;
  improvement_areas: string[];
  created_at: string;
}

const FundabilityScoring = () => {
  const [scores, setScores] = useState<FundabilityScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Assessment form state
  const [marketPotential, setMarketPotential] = useState([75]);
  const [valueProp, setValueProp] = useState([75]);
  const [team, setTeam] = useState([75]);
  const [businessModel, setBusinessModel] = useState([75]);
  const [traction, setTraction] = useState([75]);
  const [exitPotential, setExitPotential] = useState([75]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    if (user) {
      loadFundabilityScores();
    }
  }, [user]);

  const loadFundabilityScores = async () => {
    try {
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error loading fundability scores:', error);
      toast({
        title: "Error",
        description: "Failed to load fundability scores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAssessment = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (startupError) throw startupError;

      // Calculate overall score using the database function
      const { data: calculatedScore, error: calcError } = await supabase
        .rpc('calculate_fundability_score', {
          market_potential: marketPotential[0],
          value_proposition: valueProp[0],
          team: team[0],
          business_model: businessModel[0],
          traction: traction[0],
          exit_potential: exitPotential[0]
        });

      if (calcError) throw calcError;

      const { error } = await supabase
        .from('fundability_scores')
        .insert({
          startup_id: startup.id,
          score: calculatedScore,
          market_potential_score: marketPotential[0],
          value_proposition_score: valueProp[0],
          team_score: team[0],
          business_model_score: businessModel[0],
          traction_score: traction[0],
          exit_potential_score: exitPotential[0],
          feedback: { additional_info: additionalInfo },
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Assessment Submitted",
        description: "Your fundability assessment has been submitted for review",
      });

      setShowAssessment(false);
      loadFundabilityScores();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'improvement': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'rejected': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'improvement': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Fundability Scoring
          </CardTitle>
          <CardDescription>
            Get your startup evaluated and receive personalized improvement recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scores.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get Your First Fundability Score</h3>
              <p className="text-muted-foreground mb-4">
                Complete a comprehensive assessment to understand your startup's investment readiness
              </p>
              <Button onClick={() => setShowAssessment(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Start Assessment
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Latest Score: {scores[0]?.score}/100</h3>
                <p className="text-muted-foreground">
                  Last assessed: {new Date(scores[0]?.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button onClick={() => setShowAssessment(true)} variant="outline">
                New Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Scores */}
      {scores.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scores.map((score) => (
              <div key={score.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(score.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(score.score)}`}>
                          {score.score}/100
                        </span>
                        <Badge className={getStatusColor(score.status)}>
                          {score.status.charAt(0).toUpperCase() + score.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(score.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Market Potential</span>
                    </div>
                    <Progress value={score.market_potential_score} className="h-2" />
                    <span className="text-xs text-muted-foreground">{score.market_potential_score}/100</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm">Value Proposition</span>
                    </div>
                    <Progress value={score.value_proposition_score} className="h-2" />
                    <span className="text-xs text-muted-foreground">{score.value_proposition_score}/100</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Team</span>
                    </div>
                    <Progress value={score.team_score} className="h-2" />
                    <span className="text-xs text-muted-foreground">{score.team_score}/100</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Business Model</span>
                    </div>
                    <Progress value={score.business_model_score} className="h-2" />
                    <span className="text-xs text-muted-foreground">{score.business_model_score}/100</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      <span className="text-sm">Traction</span>
                    </div>
                    <Progress value={score.traction_score} className="h-2" />
                    <span className="text-xs text-muted-foreground">{score.traction_score}/100</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">Exit Potential</span>
                    </div>
                    <Progress value={score.exit_potential_score} className="h-2" />
                    <span className="text-xs text-muted-foreground">{score.exit_potential_score}/100</span>
                  </div>
                </div>

                {/* Improvement Areas */}
                {score.improvement_areas && score.improvement_areas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Improvement Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {score.improvement_areas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Assessment Form Modal */}
      {showAssessment && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Fundability Assessment</CardTitle>
            <CardDescription>
              Rate your startup across key investment criteria (1-100 scale)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Market Potential ({marketPotential[0]}/100)
                </Label>
                <Slider
                  value={marketPotential}
                  onValueChange={setMarketPotential}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4" />
                  Value Proposition ({valueProp[0]}/100)
                </Label>
                <Slider
                  value={valueProp}
                  onValueChange={setValueProp}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4" />
                  Team Quality ({team[0]}/100)
                </Label>
                <Slider
                  value={team}
                  onValueChange={setTeam}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4" />
                  Business Model ({businessModel[0]}/100)
                </Label>
                <Slider
                  value={businessModel}
                  onValueChange={setBusinessModel}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Rocket className="w-4 h-4" />
                  Traction ({traction[0]}/100)
                </Label>
                <Slider
                  value={traction}
                  onValueChange={setTraction}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" />
                  Exit Potential ({exitPotential[0]}/100)
                </Label>
                <Slider
                  value={exitPotential}
                  onValueChange={setExitPotential}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="additional-info">Additional Information</Label>
                <Textarea
                  id="additional-info"
                  placeholder="Any additional context about your startup..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={submitAssessment}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Assessment"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAssessment(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FundabilityScoring;
