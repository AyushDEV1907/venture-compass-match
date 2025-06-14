
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, PlayCircle, BookOpen, Users, TrendingUp, DollarSign, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";

interface Improvement {
  id: string;
  improvement_type: string;
  status: string;
  notes: string;
  resources_used: string[];
  completed_at: string;
  created_at: string;
}

const ImprovementPlan = () => {
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [selectedImprovement, setSelectedImprovement] = useState<Improvement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadImprovements();
    }
  }, [user]);

  const loadImprovements = async () => {
    try {
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (startupError) throw startupError;

      const { data, error } = await supabase
        .from('startup_improvements')
        .select('*')
        .eq('startup_id', startup.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImprovements(data || []);
    } catch (error) {
      console.error('Error loading improvements:', error);
      toast({
        title: "Error",
        description: "Failed to load improvement plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateImprovementStatus = async (improvementId: string, status: string) => {
    setIsUpdating(true);
    try {
      const updates: any = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
      if (notes) {
        updates.notes = notes;
      }

      const { error } = await supabase
        .from('startup_improvements')
        .update(updates)
        .eq('id', improvementId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Improvement status updated successfully",
      });

      setSelectedImprovement(null);
      setNotes("");
      loadImprovements();
    } catch (error) {
      console.error('Error updating improvement:', error);
      toast({
        title: "Error",
        description: "Failed to update improvement status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getImprovementIcon = (type: string) => {
    switch (type) {
      case 'pitch_deck': return <BookOpen className="w-5 h-5" />;
      case 'financial_model': return <DollarSign className="w-5 h-5" />;
      case 'team_building': return <Users className="w-5 h-5" />;
      case 'market_analysis': return <TrendingUp className="w-5 h-5" />;
      case 'business_model': return <Lightbulb className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatImprovementType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getCompletionPercentage = () => {
    if (improvements.length === 0) return 0;
    const completed = improvements.filter(imp => imp.status === 'completed').length;
    return (completed / improvements.length) * 100;
  };

  const getResourcesForType = (type: string) => {
    const resources = {
      pitch_deck: [
        "Guy Kawasaki's 10/20/30 Rule",
        "Sequoia Capital Pitch Deck Template",
        "Y Combinator Pitch Deck Guide"
      ],
      financial_model: [
        "Financial Modeling Best Practices",
        "SaaS Metrics Guide",
        "Unit Economics Calculator"
      ],
      team_building: [
        "Startup Hiring Playbook",
        "Equity Compensation Guide",
        "Remote Team Building Strategies"
      ],
      market_analysis: [
        "TAM/SAM/SOM Framework",
        "Competitive Analysis Template",
        "Market Research Methodology"
      ],
      business_model: [
        "Business Model Canvas",
        "Lean Startup Methodology",
        "Revenue Model Optimization"
      ]
    };
    return resources[type as keyof typeof resources] || [];
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
            <TrendingUp className="w-6 h-6" />
            Improvement Plan
          </CardTitle>
          <CardDescription>
            Track your progress on recommended improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {improvements.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Improvement Plan Yet</h3>
              <p className="text-muted-foreground">
                Complete a fundability assessment to receive personalized improvement recommendations
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(getCompletionPercentage())}% Complete
                    </span>
                  </div>
                  <Progress value={getCompletionPercentage()} className="h-3" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {improvements.filter(imp => imp.status === 'completed').length} of {improvements.length} improvements completed
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Improvements List */}
      {improvements.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Your Improvement Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {improvements.map((improvement) => (
              <div key={improvement.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getImprovementIcon(improvement.improvement_type)}
                    <div>
                      <h4 className="font-medium">
                        {formatImprovementType(improvement.improvement_type)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(improvement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(improvement.status)}
                    <Badge className={getStatusColor(improvement.status)}>
                      {improvement.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {improvement.notes && (
                  <div className="mb-3">
                    <p className="text-sm"><strong>Notes:</strong> {improvement.notes}</p>
                  </div>
                )}

                <div className="mb-3">
                  <h5 className="text-sm font-medium mb-2">Recommended Resources:</h5>
                  <div className="flex flex-wrap gap-2">
                    {getResourcesForType(improvement.improvement_type).map((resource, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {improvement.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => updateImprovementStatus(improvement.id, 'in_progress')}
                      disabled={isUpdating}
                    >
                      Start Working
                    </Button>
                  )}
                  {improvement.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedImprovement(improvement)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Complete
                    </Button>
                  )}
                  {improvement.status === 'completed' && improvement.completed_at && (
                    <p className="text-sm text-green-600">
                      ✓ Completed on {new Date(improvement.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completion Modal */}
      {selectedImprovement && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Complete Improvement</CardTitle>
            <CardDescription>
              Mark "{formatImprovementType(selectedImprovement.improvement_type)}" as completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Notes (optional)
              </label>
              <Textarea
                placeholder="What did you accomplish? What did you learn?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => updateImprovementStatus(selectedImprovement.id, 'completed')}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? "Updating..." : "Mark Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedImprovement(null);
                  setNotes("");
                }}
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

export default ImprovementPlan;
