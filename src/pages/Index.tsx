
import { useAuth } from "@/components/AuthContext";
import AuthPage from "@/components/AuthPage";
import StartupDashboard from "@/components/StartupDashboard";
import InvestorDashboard from "@/components/InvestorDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Zap, Star, Building2, ArrowRight } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const { user, userProfile, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user clicked to sign up/login
  if (showAuth && !user) {
    return <AuthPage />;
  }

  // Show dashboard if user is logged in and profile exists
  if (user && userProfile) {
    try {
      return userProfile.user_type === 'startup' ? 
        <StartupDashboard onLogout={() => {}} /> : 
        <InvestorDashboard onLogout={() => {}} />;
    } catch (error) {
      console.error('Error rendering dashboard:', error);
      return <AuthPage />;
    }
  }

  // Show landing page (default view)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Bar */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">VentureCompass</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowAuth(true)}
                className="text-foreground"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10" />
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Matching
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Where Startups Meet
              <br />
              Perfect Investors
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join the most intelligent marketplace connecting ambitious startups with strategic investors. 
              Our AI learns your preferences to deliver perfect matches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-lg px-8 py-6"
              >
                Start Matching Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowAuth(true)}
                className="text-lg px-8 py-6 border-2"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">2,500+</h3>
              <p className="text-muted-foreground">Active Startups</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">850+</h3>
              <p className="text-muted-foreground">Verified Investors</p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">$2.1B+</h3>
              <p className="text-muted-foreground">Funding Raised</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6">Intelligent Matching Technology</h2>
          <p className="text-xl text-muted-foreground">
            Our AI-powered platform learns from every interaction to deliver increasingly accurate matches.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Calibration</h3>
                <p className="text-muted-foreground">Investors review 5 demo startups to calibrate preferences and train our matching algorithm.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-time Learning</h3>
                <p className="text-muted-foreground">Every swipe, flag, and interaction improves future recommendations for better matches.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Seamless Communication</h3>
                <p className="text-muted-foreground">Direct chat between matched startups and investors with built-in collaboration tools.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl" />
            <Card className="relative border-0 shadow-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Free</span>
                  <Badge variant="secondary">5 matches/month</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <span className="font-medium">Pro</span>
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">50 matches/month</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <span className="font-medium">Premium</span>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">Unlimited + Analytics</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful startups and investors already using our platform.</p>
          <Button 
            size="lg" 
            onClick={() => setShowAuth(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center space-x-2">
            <Building2 className="w-6 h-6" />
            <span className="text-lg font-bold">VentureCompass</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            © 2024 VentureCompass. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
