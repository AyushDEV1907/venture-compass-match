
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, TrendingUp, MessageSquare, Star, Eye, Target, LogOut, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface StartupDashboardProps {
  onLogout: () => void;
}

const StartupDashboard = ({ onLogout }: StartupDashboardProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState('free');

  useEffect(() => {
    const savedProfile = localStorage.getItem('startupProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    const savedSubscription = localStorage.getItem('subscription') || 'free';
    setSubscription(savedSubscription);
  }, []);

  const stats = [
    { label: 'Profile Views', value: 89, icon: Eye, change: '+12' },
    { label: 'Investor Matches', value: 7, icon: Target, change: '+3' },
    { label: 'Messages', value: 4, icon: MessageSquare, change: '+2' },
    { label: 'Pitch Views', value: 23, icon: TrendingUp, change: '+8' }
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
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="pitch">Pitch Deck</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your startup presence</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Building2 className="w-6 h-6 mr-2" />
                  Update Profile
                </Button>
                <Button variant="outline" className="h-20">
                  <Users className="w-6 h-6 mr-2" />
                  View Matches
                </Button>
                <Button variant="outline" className="h-20">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  Messages
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Startup Profile</CardTitle>
                <CardDescription>Your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Profile management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Investor Matches</CardTitle>
                <CardDescription>Investors interested in your startup</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Matches will appear here when investors show interest...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pitch">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Pitch Deck</CardTitle>
                <CardDescription>Upload and manage your pitch materials</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Pitch deck management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StartupDashboard;
