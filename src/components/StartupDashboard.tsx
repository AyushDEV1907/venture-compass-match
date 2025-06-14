
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthContext";
import { useStartupStats } from "@/hooks/useStartupStats";
import FundabilityScoring from "@/components/startup/FundabilityScoring";
import ImprovementPlan from "@/components/startup/ImprovementPlan";
import QuarterlyCheckin from "@/components/startup/QuarterlyCheckin";
import StartupMatches from "@/components/StartupMatches";
import StartupProfile from "@/components/StartupProfile";
import StartupPitchDeck from "@/components/StartupPitchDeck";
import DashboardHeader from "@/components/startup/DashboardHeader";
import DashboardStats from "@/components/startup/DashboardStats";
import DashboardOverview from "@/components/startup/DashboardOverview";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader
        userProfile={userProfile}
        subscription={subscription}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <DashboardStats stats={stats} statsLoading={statsLoading} />

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

          <DashboardOverview />

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
