
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Target, FileText, Users, TrendingUp, BarChart3 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Improvement {
  id: string;
  improvement_type: string;
  status: string;
  notes: string;
  resources_used: string[];
  completed_at: string | null;
  created_at: string;
}

const ImprovementPlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const createImprovementPlan = async () => {
    try {
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (startupError) throw startupError;

      // Get latest fundability score
      const { data: latestScore, error: scoreError } = await supabase
        .from('fundability_scores')
        .select('*')
        .eq('startup_id', startup.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (scoreError) throw scoreError;

      // Create improvement items based on score
      const improvementItems = [
        {
          startup_id: startup.id,
          fundability_score_id: latestScore.id,
          improvement_type: 'pitch_deck',
          status: 'pending'
        },
        {
          startup_id: startup.id,
          fundability_score_id: latestScore.id,
          improvement_type: 'financial_model',
          status: 'pending'
        },
        {
          startup_id: startup.id,
          fundability_score_id: latestScore.id,
          improvement_type: 'market_analysis',
          status: 'pending'
        }
      ];

      const { error: insertError } = await supabase
        .from('startup_improvements')
        .insert(improvementItems);

      if (insertError) throw insertError;

      await loadImprovements();
      
      toast({
        title: "Improvement Plan Created",
        description: "Your personalized improvement plan is ready!",
      });
    } catch (error) {
      console.error('Error creating improvement plan:', error);
      toast({
        title: "Error",
        description: "Failed to create improvement plan",
        variant: "destructive",
      });
    }
  };

  const updateImprovementStatus = async (improvementId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('startup_improvements')
        .update(updateData)
        .eq('id', improvementId);

      if (error) throw error;

      await loadImprovements();
      
      toast({
        title: "Progress Updated",
        description: `Improvement marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating improvement:', error);
      toast({
        title: "Error",
        description: "Failed to update improvement status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getImprovementIcon = (type: string) => {
    switch (type) {
      case 'pitch_deck':
        return FileText;
      case 'financial_model':
        return BarChart3;
      case 'team_building':
        return Users;
      case 'market_analysis':
        return TrendingUp;
      default:
        return Target;
    }
  };

  const getImprovementTitle = (type: string) => {
    switch (type) {
      case 'pitch_deck':
        return 'Pitch Deck Optimization';
      case 'financial_model':
        return 'Financial Model Enhancement';
      case 'team_building':
        return 'Team Building & Hiring';
      case 'market_analysis':
        return 'Market Analysis Improvement';
      case 'business_model':
        return 'Business Model Refinement';
      default:
        return 'General Improvement';
    }
  };

  const getImprovementDescription = (type: string) => {
    switch (type) {
      case 'pitch_deck':
        return 'Refine your pitch deck to better communicate your value proposition and growth potential';
      case 'financial_model':
        return 'Improve financial projections and demonstrate clear path to profitability';
      case 'team_building':
        return 'Strengthen your team with key hires and advisor additions';
      case 'market_analysis':
        return 'Conduct deeper market research and validate your target market size';
      case 'business_model':
        return 'Optimize your revenue model and pricing strategy';
      default:
        return 'Focus on general business improvements';
    }
  };

  const resources = {
    pitch_deck: [
      'Guy Kawasaki\'s 10/20/30 Rule',
      'Y Combinator Pitch Deck Template',
      'Sequoia Capital Pitch Deck Guide'
    ],
    financial_model: [
      'Financial Modeling Best Practices',
      'Unit Economics Calculator',
      'Revenue Forecasting Templates'
    ],
    market_analysis: [
      'TAM/SAM/SOM Framework',
      'Competitive Analysis Template',
      'Customer Interview Guide'
    ]
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
            <Target className="w-6 h-6" />
            Improvement Plan
          </CardTitle>
          <CardDescription>
            Personalized action items to improve your fundability score
          </CardDescription>
        </CardHeader>
        <CardContent>
          {improvements.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Create Your Improvement Plan</h3>
              <p className="text-muted-foreground mb-6">
                Get personalized recommendations based on your fundability score
              </p>
              <Button 
                onClick={createImprovementPlan}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Target className="w-4 h-4 mr-2" />
                Generate Plan
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">Active Items</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {improvements.filter(i => i.status !== 'completed').map((improvement) => {
                  const Icon = getImprovementIcon(improvement.improvement_type);
                  return (
                    <Card key={improvement.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-blue-600" />
                            <div>
                              <h3 className="font-semibold">
                                {getImprovementTitle(improvement.improvement_type)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {getImprovementDescription(improvement.improvement_type)}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(improvement.status)}
                        </div>
                        
                        <div className="flex gap-2">
                          {improvement.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateImprovementStatus(improvement.id, 'in_progress')}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {improvement.status === 'in_progress' && (
                            <Button
                              size="sm"
                              onClick={() => updateImprovementStatus(improvement.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {improvements.filter(i => i.status === 'completed').map((improvement) => {
                  const Icon = getImprovementIcon(improvement.improvement_type);
                  return (
                    <Card key={improvement.id} className="border bg-green-50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6 text-green-600" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-green-800">
                              {getImprovementTitle(improvement.improvement_type)}
                            </h3>
                            <p className="text-sm text-green-600">
                              Completed on {new Date(improvement.completed_at!).toLocaleDateString()}
                            </p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {improvements.filter(i => i.status === 'completed').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No completed improvements yet</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid gap-6">
                  {Object.entries(resources).map(([type, resourceList]) => (
                    <Card key={type} className="border">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {getImprovementTitle(type)} Resources
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {resourceList.map((resource, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovementPlan;
