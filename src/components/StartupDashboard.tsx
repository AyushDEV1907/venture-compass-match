
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, TrendingUp, MessageSquare, Star, Eye, Target, LogOut, DollarSign, Award, Calendar, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { useStartupStats } from "@/hooks/useStartupStats";
import FundabilityScoring from "@/components/startup/FundabilityScoring";
import ImprovementPlan from "@/components/startup/ImprovementPlan";
import QuarterlyCheckin from "@/components/startup/QuarterlyCheckin";
import StartupMatches from "@/components/StartupMatches";
import StartupProfile from "@/components/StartupProfile";
import StartupPitchDeck from "@/components/StartupPitchDeck";

interface StartupDashboardProps {
  onLogout: () => void;
}

const StartupDashboard = ({ onLogout }: StartupDashboardProps) => {
  const { signOut, userProfile } = useAuth();
  const [subscription, setSubscription] = useState('free');
  const { stats, loading: statsLoading } = useStartupStats();

  useEffect(() => {
    const savedSubscription = localStorage.getItem('subscription') || 'free';
    setSubscription(savedSubscription);
  }, []);

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const staticStats = [
    { label: 'Profile Views', value: 89, icon: Eye, change: '+12' },
    { label: 'Investor Matches', value: 7, icon: Target, change: '+3' },
    { label: 'Messages', value: 4, icon: MessageSquare, change: '+2' },
    { label: 'Pitch Views', value: 23, icon: TrendingUp, change: '+8' }
  ];

  // Use real stats if available, otherwise fall back to static data
  const displayStats = stats ? [
    { label: 'Profile Views', value: stats.profile_views, icon: Eye, change: '+12' },
    { label: 'Investor Matches', value: stats.investor_matches, icon: Target, change: '+3' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, change: '+2' },
    { label: 'Pitch Views', value: stats.pitch_views, icon: TrendingUp, change: '+8' }
  ] : staticStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Startup Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {userProfile?.company || 'Startup'}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/marketplace">
                <Button variant="outline">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Browse Investors
                </Button>
              </Link>
              <Badge 
                className={`${
                  subscription === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                  subscription === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                  'bg-muted text-muted-foreground'
                } text-white border-0`}
              >
                {subscription.toUpperCase()}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {displayStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">
                      {statsLoading ? (
                        <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="fundability">Fundability Score</TabsTrigger>
            <TabsTrigger value="improvement">Improvement Plan</TabsTrigger>
            <TabsTrigger value="checkin">Quarterly Check-in</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="pitch">Pitch Deck</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your startup presence</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                  <Button className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white justify-start">
                    <Award className="w-6 h-6 mr-4" />
                    <div className="text-left">
                      <div className="font-semibold">Check Fundability Score</div>
                      <div className="text-sm opacity-90">Get AI assessment</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start">
                    <Target className="w-6 h-6 mr-4" />
                    <div className="text-left">
                      <div className="font-semibold">View Improvement Plan</div>
                      <div className="text-sm text-muted-foreground">Enhance your profile</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start">
                    <Calendar className="w-6 h-6 mr-4" />
                    <div className="text-left">
                      <div className="font-semibold">Quarterly Check-in</div>
                      <div className="text-sm text-muted-foreground">Update progress</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Investment Readiness</CardTitle>
                  <CardDescription>Your current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-semibold">Fundability Score</p>
                          <p className="text-sm text-muted-foreground">Get AI assessment</p>
                        </div>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold">Profile Complete</p>
                          <p className="text-sm text-muted-foreground">All sections filled</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-yellow-600" />
                        <div>
                          <p className="font-semibold">Pitch Deck</p>
                          <p className="text-sm text-muted-foreground">Upload materials</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <StartupProfile />
          </TabsContent>

          <TabsContent value="fundability">
            <FundabilityScoring />
          </TabsContent>

          <TabsContent value="improvement">
            <ImprovementPlan />
          </TabsContent>

          <TabsContent value="checkin">
            <QuarterlyCheckin />
          </TabsContent>

          <TabsContent value="matches">
            <StartupMatches />
          </TabsContent>

          <TabsContent value="pitch">
            <StartupPitchDeck />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StartupDashboard;
