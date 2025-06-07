
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, FileText, MessageSquare, Star, Upload, Eye, TrendingUp, LogOut } from "lucide-react";
import StartupProfile from "@/components/StartupProfile";
import StartupPitchDeck from "@/components/StartupPitchDeck";
import StartupMatches from "@/components/StartupMatches";
import SubscriptionPlans from "@/components/SubscriptionPlans";

interface StartupDashboardProps {
  onLogout: () => void;
}

const StartupDashboard = ({ onLogout }: StartupDashboardProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState('free');

  useEffect(() => {
    // Load startup profile from localStorage
    const savedProfile = localStorage.getItem('startupProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    const savedSubscription = localStorage.getItem('subscription') || 'free';
    setSubscription(savedSubscription);
  }, []);

  const stats = [
    { label: 'Profile Views', value: 45, icon: Eye, change: '+12%' },
    { label: 'Interested Investors', value: 8, icon: Users, change: '+3' },
    { label: 'Messages', value: 12, icon: MessageSquare, change: '+4' },
    { label: 'Pitch Deck Downloads', value: 23, icon: FileText, change: '+7' }
  ];

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
                  Welcome back, {profile?.company || 'Startup'}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                className={`${
                  subscription === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                  subscription === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                  'bg-muted text-muted-foreground'
                } text-white border-0`}
              >
                {subscription.toUpperCase()}
              </Badge>
              <Button variant="outline" onClick={onLogout}>
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
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
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
            <TabsTrigger value="pitch-deck">Pitch Deck</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Profile Completion
                  </CardTitle>
                  <CardDescription>Complete your profile to attract more investors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>✅ Basic Information</span>
                      <Badge variant="secondary">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>✅ Company Details</span>
                      <Badge variant="secondary">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>⏳ Pitch Deck</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>⏳ Financial Data</span>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest updates on your startup profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">TechVentures showed interest in your startup</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">New message from InnovateCapital</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Profile viewed by 3 new investors</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <StartupProfile />
          </TabsContent>

          <TabsContent value="pitch-deck">
            <StartupPitchDeck />
          </TabsContent>

          <TabsContent value="matches">
            <StartupMatches />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionPlans currentPlan={subscription} userType="startup" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StartupDashboard;
