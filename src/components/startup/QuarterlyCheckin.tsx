
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Users, DollarSign, Building2, Target } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CheckIn {
  id: string;
  quarter: string;
  year: number;
  revenue_growth: number;
  user_growth: number;
  team_changes: number;
  funding_raised: number;
  new_partnerships: number;
  product_updates: string;
  challenges: string;
  goals_next_quarter: string;
  rescoring_needed: boolean;
  created_at: string;
}

const QuarterlyCheckin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    quarter: `Q${Math.floor((new Date().getMonth() / 3)) + 1}`,
    year: new Date().getFullYear(),
    revenue_growth: '',
    user_growth: '',
    team_changes: '',
    funding_raised: '',
    new_partnerships: '',
    product_updates: '',
    challenges: '',
    goals_next_quarter: ''
  });

  useEffect(() => {
    if (user) {
      loadCheckIns();
    }
  }, [user]);

  const loadCheckIns = async () => {
    try {
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (startupError) throw startupError;

      const { data, error } = await supabase
        .from('startup_checkins')
        .select('*')
        .eq('startup_id', startup.id)
        .order('year', { ascending: false })
        .order('quarter', { ascending: false });

      if (error) throw error;

      setCheckIns(data || []);
    } catch (error) {
      console.error('Error loading check-ins:', error);
      toast({
        title: "Error",
        description: "Failed to load quarterly check-ins",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (startupError) throw startupError;

      const { error } = await supabase
        .from('startup_checkins')
        .insert({
          startup_id: startup.id,
          quarter: formData.quarter,
          year: formData.year,
          revenue_growth: parseFloat(formData.revenue_growth) || 0,
          user_growth: parseFloat(formData.user_growth) || 0,
          team_changes: parseInt(formData.team_changes) || 0,
          funding_raised: parseFloat(formData.funding_raised) || 0,
          new_partnerships: parseInt(formData.new_partnerships) || 0,
          product_updates: formData.product_updates,
          challenges: formData.challenges,
          goals_next_quarter: formData.goals_next_quarter,
          rescoring_needed: parseFloat(formData.revenue_growth) > 50 || parseFloat(formData.user_growth) > 100
        });

      if (error) throw error;

      await loadCheckIns();
      setShowForm(false);
      setFormData({
        quarter: `Q${Math.floor((new Date().getMonth() / 3)) + 1}`,
        year: new Date().getFullYear(),
        revenue_growth: '',
        user_growth: '',
        team_changes: '',
        funding_raised: '',
        new_partnerships: '',
        product_updates: '',
        challenges: '',
        goals_next_quarter: ''
      });

      toast({
        title: "Check-in Submitted",
        description: "Your quarterly update has been recorded",
      });
    } catch (error) {
      console.error('Error submitting check-in:', error);
      toast({
        title: "Error",
        description: "Failed to submit quarterly check-in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentQuarter = () => {
    const month = new Date().getMonth();
    return `Q${Math.floor(month / 3) + 1}`;
  };

  const hasCurrentQuarterCheckIn = () => {
    const currentQuarter = getCurrentQuarter();
    const currentYear = new Date().getFullYear();
    return checkIns.some(checkIn => 
      checkIn.quarter === currentQuarter && checkIn.year === currentYear
    );
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
            <Calendar className="w-6 h-6" />
            Quarterly Check-ins
          </CardTitle>
          <CardDescription>
            Track your startup's progress and trigger rescoring when needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">
                {getCurrentQuarter()} {new Date().getFullYear()} Update
              </h3>
              <p className="text-muted-foreground">
                {hasCurrentQuarterCheckIn() 
                  ? "You've completed this quarter's check-in" 
                  : "Complete your quarterly progress update"
                }
              </p>
            </div>
            {!hasCurrentQuarterCheckIn() && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Start Check-in
              </Button>
            )}
          </div>

          {showForm && (
            <Card className="border-2 border-blue-200 mb-6">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="revenue_growth">Revenue Growth (%)</Label>
                      <Input
                        id="revenue_growth"
                        type="number"
                        step="0.1"
                        value={formData.revenue_growth}
                        onChange={(e) => setFormData({...formData, revenue_growth: e.target.value})}
                        placeholder="e.g., 25.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_growth">User Growth (%)</Label>
                      <Input
                        id="user_growth"
                        type="number"
                        step="0.1"
                        value={formData.user_growth}
                        onChange={(e) => setFormData({...formData, user_growth: e.target.value})}
                        placeholder="e.g., 150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="team_changes">Team Size Changes</Label>
                      <Input
                        id="team_changes"
                        type="number"
                        value={formData.team_changes}
                        onChange={(e) => setFormData({...formData, team_changes: e.target.value})}
                        placeholder="e.g., +3 or -1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="funding_raised">Funding Raised ($)</Label>
                      <Input
                        id="funding_raised"
                        type="number"
                        value={formData.funding_raised}
                        onChange={(e) => setFormData({...formData, funding_raised: e.target.value})}
                        placeholder="e.g., 500000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new_partnerships">New Partnerships</Label>
                      <Input
                        id="new_partnerships"
                        type="number"
                        value={formData.new_partnerships}
                        onChange={(e) => setFormData({...formData, new_partnerships: e.target.value})}
                        placeholder="e.g., 2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="product_updates">Product Updates</Label>
                    <Textarea
                      id="product_updates"
                      value={formData.product_updates}
                      onChange={(e) => setFormData({...formData, product_updates: e.target.value})}
                      placeholder="Describe major product updates, new features, or releases..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="challenges">Challenges Faced</Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                      placeholder="What challenges did you face this quarter?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals_next_quarter">Goals for Next Quarter</Label>
                    <Textarea
                      id="goals_next_quarter"
                      value={formData.goals_next_quarter}
                      onChange={(e) => setFormData({...formData, goals_next_quarter: e.target.value})}
                      placeholder="What are your key objectives for the next quarter?"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Check-in"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Previous Check-ins */}
          <div className="space-y-4">
            <h4 className="font-semibold">Previous Check-ins</h4>
            {checkIns.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No check-ins yet. Complete your first quarterly update!</p>
              </div>
            ) : (
              checkIns.map((checkIn) => (
                <Card key={checkIn.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">
                          {checkIn.quarter} {checkIn.year}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(checkIn.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {checkIn.rescoring_needed && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          Rescoring Recommended
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-semibold">+{checkIn.revenue_growth}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Users</p>
                          <p className="font-semibold">+{checkIn.user_growth}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Team</p>
                          <p className="font-semibold">{checkIn.team_changes > 0 ? '+' : ''}{checkIn.team_changes}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Funding</p>
                          <p className="font-semibold">${checkIn.funding_raised.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Partners</p>
                          <p className="font-semibold">{checkIn.new_partnerships}</p>
                        </div>
                      </div>
                    </div>

                    {checkIn.challenges && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Challenges:</p>
                        <p className="text-sm text-muted-foreground">{checkIn.challenges}</p>
                      </div>
                    )}

                    {checkIn.goals_next_quarter && (
                      <div>
                        <p className="text-sm font-medium">Goals:</p>
                        <p className="text-sm text-muted-foreground">{checkIn.goals_next_quarter}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuarterlyCheckin;
