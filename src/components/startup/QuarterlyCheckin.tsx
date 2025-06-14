
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";

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
  created_at: string;
}

const QuarterlyCheckin = () => {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Form state
  const [quarter, setQuarter] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [revenueGrowth, setRevenueGrowth] = useState("");
  const [userGrowth, setUserGrowth] = useState("");
  const [teamChanges, setTeamChanges] = useState("");
  const [fundingRaised, setFundingRaised] = useState("");
  const [newPartnerships, setNewPartnerships] = useState("");
  const [productUpdates, setProductUpdates] = useState("");
  const [challenges, setChallenges] = useState("");
  const [goalsNextQuarter, setGoalsNextQuarter] = useState("");

  useEffect(() => {
    if (user) {
      loadCheckIns();
      // Set default quarter
      const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
      setQuarter(`Q${currentQuarter}`);
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
      setCheckins(data || []);
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

  const submitCheckIn = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (startupError) throw startupError;

      const { error } = await supabase
        .from('startup_checkins')
        .insert({
          startup_id: startup.id,
          quarter,
          year: parseInt(year),
          revenue_growth: parseFloat(revenueGrowth) || 0,
          user_growth: parseFloat(userGrowth) || 0,
          team_changes: parseInt(teamChanges) || 0,
          funding_raised: parseFloat(fundingRaised) || 0,
          new_partnerships: parseInt(newPartnerships) || 0,
          product_updates: productUpdates,
          challenges: challenges,
          goals_next_quarter: goalsNextQuarter,
          rescoring_needed: true // Trigger rescoring after check-in
        });

      if (error) throw error;

      toast({
        title: "Check-in Submitted",
        description: "Your quarterly check-in has been recorded successfully",
      });

      // Reset form
      setShowForm(false);
      setRevenueGrowth("");
      setUserGrowth("");
      setTeamChanges("");
      setFundingRaised("");
      setNewPartnerships("");
      setProductUpdates("");
      setChallenges("");
      setGoalsNextQuarter("");

      loadCheckIns();
    } catch (error) {
      console.error('Error submitting check-in:', error);
      toast({
        title: "Error",
        description: "Failed to submit check-in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            <Calendar className="w-6 h-6" />
            Quarterly Check-ins
          </CardTitle>
          <CardDescription>
            Track your progress and trigger fundability score updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checkins.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start Your First Check-in</h3>
              <p className="text-muted-foreground mb-4">
                Regular check-ins help track progress and keep your fundability score current
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Start Check-in
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Latest: {checkins[0]?.quarter} {checkins[0]?.year}</h3>
                <p className="text-muted-foreground">
                  {checkins.length} check-in{checkins.length !== 1 ? 's' : ''} completed
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} variant="outline">
                New Check-in
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Check-in History */}
      {checkins.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Check-in History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {checkins.map((checkin) => (
              <div key={checkin.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{checkin.quarter} {checkin.year}</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date(checkin.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {checkin.revenue_growth}%
                    </div>
                    <div className="text-xs text-muted-foreground">Revenue Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {checkin.user_growth}%
                    </div>
                    <div className="text-xs text-muted-foreground">User Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(checkin.funding_raised)}
                    </div>
                    <div className="text-xs text-muted-foreground">Funding Raised</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      +{checkin.team_changes}
                    </div>
                    <div className="text-xs text-muted-foreground">Team Changes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="text-2xl font-bold text-teal-600">
                      {checkin.new_partnerships}
                    </div>
                    <div className="text-xs text-muted-foreground">Partnerships</div>
                  </div>
                </div>

                {/* Qualitative Updates */}
                <div className="grid md:grid-cols-3 gap-4">
                  {checkin.product_updates && (
                    <div>
                      <h4 className="font-medium mb-2">Product Updates</h4>
                      <p className="text-sm text-muted-foreground">{checkin.product_updates}</p>
                    </div>
                  )}
                  {checkin.challenges && (
                    <div>
                      <h4 className="font-medium mb-2">Challenges</h4>
                      <p className="text-sm text-muted-foreground">{checkin.challenges}</p>
                    </div>
                  )}
                  {checkin.goals_next_quarter && (
                    <div>
                      <h4 className="font-medium mb-2">Next Quarter Goals</h4>
                      <p className="text-sm text-muted-foreground">{checkin.goals_next_quarter}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Check-in Form */}
      {showForm && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quarterly Check-in</CardTitle>
            <CardDescription>
              Update your progress for {quarter} {year}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quarter">Quarter</Label>
                <Select value={quarter} onValueChange={setQuarter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quarter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1">Q1</SelectItem>
                    <SelectItem value="Q2">Q2</SelectItem>
                    <SelectItem value="Q3">Q3</SelectItem>
                    <SelectItem value="Q4">Q4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2020"
                  max="2030"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="revenue-growth">Revenue Growth (%)</Label>
                <Input
                  id="revenue-growth"
                  type="number"
                  placeholder="0"
                  value={revenueGrowth}
                  onChange={(e) => setRevenueGrowth(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="user-growth">User Growth (%)</Label>
                <Input
                  id="user-growth"
                  type="number"
                  placeholder="0"
                  value={userGrowth}
                  onChange={(e) => setUserGrowth(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="team-changes">Team Changes</Label>
                <Input
                  id="team-changes"
                  type="number"
                  placeholder="0"
                  value={teamChanges}
                  onChange={(e) => setTeamChanges(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="funding-raised">Funding Raised ($)</Label>
                <Input
                  id="funding-raised"
                  type="number"
                  placeholder="0"
                  value={fundingRaised}
                  onChange={(e) => setFundingRaised(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="partnerships">New Partnerships</Label>
                <Input
                  id="partnerships"
                  type="number"
                  placeholder="0"
                  value={newPartnerships}
                  onChange={(e) => setNewPartnerships(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="product-updates">Product Updates</Label>
              <Textarea
                id="product-updates"
                placeholder="What new features or improvements did you ship?"
                value={productUpdates}
                onChange={(e) => setProductUpdates(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="challenges">Challenges</Label>
              <Textarea
                id="challenges"
                placeholder="What challenges did you face this quarter?"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="goals">Next Quarter Goals</Label>
              <Textarea
                id="goals"
                placeholder="What are your main goals for next quarter?"
                value={goalsNextQuarter}
                onChange={(e) => setGoalsNextQuarter(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={submitCheckIn}
                disabled={isSubmitting || !quarter || !year}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Check-in"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
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

export default QuarterlyCheckin;
