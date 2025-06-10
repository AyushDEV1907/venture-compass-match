
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Building2, MapPin, Users, TrendingUp, Eye, MessageSquare, Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { recommendationEngine } from "@/utils/recommendationEngine";
import { StartupData } from "@/types";
import StartupProfileModal from "@/components/StartupProfileModal";
import ChatModal from "@/components/ChatModal";

interface InvestorSwipeProps {
  subscription: string;
}

const InvestorSwipe = ({ subscription }: InvestorSwipeProps) => {
  const { toast } = useToast();
  const [currentStartup, setCurrentStartup] = useState<StartupData | null>(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationReason, setRecommendationReason] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const demoStartups: StartupData[] = [
    {
      id: "1",
      name: "TechFlow AI",
      description: "Revolutionary AI-powered workflow automation platform that helps businesses streamline their operations and increase productivity by 40%.",
      sector: "AI/ML",
      stage: "Series A",
      fundingTarget: "$2M",
      location: "San Francisco, CA",
      teamSize: "12",
      revenue: "$50K MRR",
      traction: "500+ enterprise customers, 300% YoY growth",
      logo: "🤖"
    },
    {
      id: "2",
      name: "EcoCharge",
      description: "Sustainable energy startup developing next-generation solar panel technology with 35% higher efficiency than traditional panels.",
      sector: "CleanTech",
      stage: "Seed",
      fundingTarget: "$1.5M",
      location: "Austin, TX",
      teamSize: "8",
      revenue: "$25K MRR",
      traction: "50+ installations, partnerships with 3 major utilities",
      logo: "🌱"
    },
    {
      id: "3",
      name: "MedLink Pro",
      description: "Telemedicine platform connecting patients with specialists globally, reducing wait times by 80% and improving healthcare accessibility.",
      sector: "HealthTech",
      stage: "Series A",
      fundingTarget: "$3M",
      location: "Boston, MA",
      teamSize: "25",
      revenue: "$120K MRR",
      traction: "10K+ patients served, 200+ doctors on platform",
      logo: "🏥"
    },
    {
      id: "4",
      name: "EduSphere",
      description: "Interactive learning platform using VR/AR technology to create immersive educational experiences for K-12 students.",
      sector: "EdTech",
      stage: "Seed",
      fundingTarget: "$800K",
      location: "Seattle, WA",
      teamSize: "6",
      revenue: "$15K MRR",
      traction: "100+ schools, 5K+ students using platform",
      logo: "🎓"
    },
    {
      id: "5",
      name: "FinSecure",
      description: "Blockchain-based financial security platform providing real-time fraud detection and prevention for digital transactions.",
      sector: "FinTech",
      stage: "Pre-seed",
      fundingTarget: "$500K",
      location: "New York, NY",
      teamSize: "4",
      revenue: "$8K MRR",
      traction: "20+ financial institutions interested, MVP launched",
      logo: "🔒"
    },
    {
      id: "6",
      name: "AgriTech Solutions",
      description: "IoT-based precision agriculture platform helping farmers optimize crop yields and reduce water usage by up to 30%.",
      sector: "AgTech",
      stage: "Seed",
      fundingTarget: "$1.2M",
      location: "Austin, TX",
      teamSize: "10",
      revenue: "$35K MRR",
      traction: "200+ farms, 50K+ acres monitored",
      logo: "🚜"
    },
    {
      id: "7",
      name: "CyberShield Pro",
      description: "AI-driven cybersecurity platform providing real-time threat detection and automated response for enterprise networks.",
      sector: "Cybersecurity",
      stage: "Series A",
      fundingTarget: "$4M",
      location: "San Francisco, CA",
      teamSize: "18",
      revenue: "$200K MRR",
      traction: "100+ enterprise clients, 99.9% threat detection rate",
      logo: "🛡️"
    },
    {
      id: "8",
      name: "RetailBot",
      description: "Autonomous retail analytics platform using computer vision to track inventory and customer behavior in real-time.",
      sector: "Retail Tech",
      stage: "Seed",
      fundingTarget: "$2.5M",
      location: "New York, NY",
      teamSize: "14",
      revenue: "$75K MRR",
      traction: "50+ retail stores, 95% accuracy in inventory tracking",
      logo: "🛒"
    }
  ];

  useEffect(() => {
    // Load initial startup data immediately without loading state for first load
    const initialStartup = demoStartups[Math.floor(Math.random() * demoStartups.length)];
    setCurrentStartup(initialStartup);
    
    // Load any existing swipe count from localStorage
    const savedSwipeCount = localStorage.getItem('investorSwipeCount');
    if (savedSwipeCount) {
      setSwipeCount(parseInt(savedSwipeCount, 10));
    }
  }, []);

  const loadNextStartup = () => {
    setIsLoading(true);
    
    // Reduce timeout and add error handling to prevent stuck loading
    const loadingTimeout = setTimeout(() => {
      try {
        // Get AI-recommended startups
        const recommendations = recommendationEngine.getRecommendedStartups(demoStartups, 3);
        
        // Mix in some random startups for variety (80% recommended, 20% random)
        const shouldUseRecommendation = Math.random() < 0.8;
        let selectedStartup: StartupData;
        
        if (shouldUseRecommendation && recommendations.length > 0) {
          selectedStartup = recommendations[Math.floor(Math.random() * Math.min(3, recommendations.length))];
          const reason = recommendationEngine.getRecommendationReason(selectedStartup);
          setRecommendationReason(reason);
        } else {
          selectedStartup = demoStartups[Math.floor(Math.random() * demoStartups.length)];
          setRecommendationReason("");
        }
        
        setCurrentStartup(selectedStartup);
      } catch (error) {
        console.error('Error loading startup:', error);
        // Fallback to random startup
        const fallbackStartup = demoStartups[Math.floor(Math.random() * demoStartups.length)];
        setCurrentStartup(fallbackStartup);
        setRecommendationReason("");
      } finally {
        setIsLoading(false);
      }
    }, 300); // Reduced from 500ms

    // Cleanup timeout on unmount
    return () => clearTimeout(loadingTimeout);
  };

  const handleSwipe = (interested: boolean) => {
    if (!currentStartup) return;

    const maxSwipes = subscription === 'free' ? 5 : subscription === 'pro' ? 50 : 999;
    
    if (swipeCount >= maxSwipes && subscription !== 'premium') {
      toast({
        title: "Search Limit Reached",
        description: `You've reached your ${subscription} plan limit. Upgrade for more searches.`,
        variant: "destructive"
      });
      return;
    }

    // Log interaction for learning
    recommendationEngine.logInteraction(currentStartup, interested);

    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    
    // Save swipe count to localStorage
    localStorage.setItem('investorSwipeCount', newSwipeCount.toString());
    
    if (interested) {
      const matches = JSON.parse(localStorage.getItem('investorMatches') || '[]');
      localStorage.setItem('investorMatches', JSON.stringify([...matches, currentStartup]));
      
      toast({
        title: "Matched! 💫",
        description: `You showed interest in ${currentStartup.name}. They can now see your profile.`,
      });
    } else {
      toast({
        title: "Learning from your feedback",
        description: "We'll use this to improve your recommendations.",
      });
    }

    loadNextStartup();
  };

  const handleViewProfile = () => {
    setShowProfileModal(true);
  };

  const handleSendMessage = () => {
    setShowChatModal(true);
  };

  const getSearchesRemaining = () => {
    const maxSwipes = subscription === 'free' ? 5 : subscription === 'pro' ? 50 : 999;
    return subscription === 'premium' ? 'Unlimited' : `${Math.max(0, maxSwipes - swipeCount)} remaining`;
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Finding your next perfect match...</p>
        </div>
      </Card>
    );
  }

  if (!currentStartup) {
    return (
      <Card className="border-0 shadow-lg h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No more startups to review right now.</p>
          <Button onClick={loadNextStartup} className="mt-4">Refresh</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discover Startups</h2>
        <Badge variant="outline">{getSearchesRemaining()}</Badge>
      </div>

      {/* AI Recommendation Notice */}
      {recommendationReason && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
                  AI Recommendation
                  <Sparkles className="w-4 h-4" />
                </h4>
                <p className="text-sm text-blue-600">{recommendationReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-2xl overflow-hidden">
        <div className="relative h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                  {currentStartup.logo}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{currentStartup.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                      {currentStartup.sector}
                    </Badge>
                    <Badge variant="outline">{currentStartup.stage}</Badge>
                    {currentStartup.recommendationScore && (
                      <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
                        {currentStartup.recommendationScore}% match
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {currentStartup.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-semibold">{currentStartup.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-semibold">{currentStartup.teamSize} people</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{currentStartup.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Seeking</p>
                    <p className="font-semibold">{currentStartup.fundingTarget}</p>
                  </div>
                </div>
              </div>

              {/* Traction */}
              <div className="p-4 bg-white rounded-lg mb-6">
                <h4 className="font-semibold mb-2">Key Traction</h4>
                <p className="text-muted-foreground">{currentStartup.traction}</p>
              </div>

              {/* Action Buttons - Fixed sizing */}
              <div className="flex gap-4 mt-auto">
                <Button
                  onClick={() => handleSwipe(false)}
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-5 h-5 mr-2" />
                  Pass
                </Button>
                <Button
                  onClick={() => handleSwipe(true)}
                  size="lg"
                  className="flex-1 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Interested
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions - Fixed sizing */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1 h-12" onClick={handleViewProfile}>
          <Eye className="w-4 h-4 mr-2" />
          View Full Profile
        </Button>
        <Button variant="outline" className="flex-1 h-12" onClick={handleSendMessage}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </div>

      {/* Modals */}
      {currentStartup && (
        <>
          <StartupProfileModal
            startup={currentStartup}
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            onMessage={handleSendMessage}
          />
          <ChatModal
            recipient={currentStartup}
            isOpen={showChatModal}
            onClose={() => setShowChatModal(false)}
          />
        </>
      )}
    </div>
  );
};

export default InvestorSwipe;
