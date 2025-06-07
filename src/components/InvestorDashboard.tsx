
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, TrendingUp, MessageSquare, Star, Eye, Target, LogOut, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import InvestorPreferences from "@/components/InvestorPreferences";
import InvestorCalibration from "@/components/InvestorCalibration";
import InvestorSwipe from "@/components/InvestorSwipe";
import InvestorMatches from "@/components/InvestorMatches";
import SubscriptionPlans from "@/components/SubscriptionPlans";

interface InvestorDashboardProps {
  onLogout: () => void;
}

const InvestorDashboard = ({ onLogout }: InvestorDashboardProps) => {
  const { signOut, userProfile } = useAuth();
  const [subscription, setSubscription] = useState('free');
  const [isCalibrated, setIsCalibrated] = useState(false);

  useEffect(() => {
    const savedSubscription = localStorage.getItem('subscription') || 'free';
    setSubscription(savedSubscription);

    const calibrationStatus = localStorage.getItem('investorCalibrated') === 'true';
    setIsCalibrated(calibrationStatus);
  }, []);

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const stats = [
    { label: 'Startups Reviewed', value: 127, icon: Eye, change: '+23' },
    { label: 'Interested Matches', value: 15, icon: Target, change: '+5' },
    { label: 'Active Conversations', value: 8, icon: MessageSquare, change: '+2' },
    { label: 'Deals in Pipeline', value: 3, icon: TrendingUp, change: '+1' }
  ];

  const getSearchLimit = () => {
    switch (subscription) {
      case 'premium': return 'Unlimited';
      case 'pro': return '50/month';
      default: return '5/month';
    }
  };

  const getUsedSearches = () => {
    switch (subscription) {
      case 'premium': return 'N/A';
      case 'pro': return '23/50';
      default: return '3/5';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Investor Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {userProfile?.company || 'Investor'}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/marketplace">
                <Button variant="outline">
                  <Building2 className="w-4 h-4 mr-2" />
                  Browse Marketplace
                </Button>
              </Link>
              <Badge 
                className={`${
                  subscription === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                  subscription === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                  'bg-muted text-muted-foreground'
                } text-white border-0`}
              >
                {subscription.toUpperCase()} - {getSearchLimit()}
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

        {/* Calibration Notice */}
        {!isCalibrated && (
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Target className="w-5 h-5" />
                Complete Your Calibration
              </CardTitle>
              <CardDescription>
                Review 5 demo startups to help our AI learn your investment preferences and improve recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Start Calibration
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="matches">My Matches</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="calibration">Calibration</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InvestorSwipe subscription={subscription} />
              </div>
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Search Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>This month:</span>
                        <span className="font-semibold">{getUsedSearches()}</span>
                      </div>
                      {subscription === 'free' && (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-orange-700">
                            Upgrade to Pro for 50 searches per month or Premium for unlimited access.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">Matched with TechFlow AI</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">New message from MedLink</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Profile view from EcoTech</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="matches">
            <InvestorMatches />
          </TabsContent>

          <TabsContent value="preferences">
            <InvestorPreferences />
          </TabsContent>

          <TabsContent value="calibration">
            <InvestorCalibration onComplete={() => setIsCalibrated(true)} />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionPlans currentPlan={subscription} userType="investor" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestorDashboard;
