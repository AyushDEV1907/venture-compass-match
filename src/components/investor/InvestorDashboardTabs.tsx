
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestorPreferences from "@/components/InvestorPreferences";
import InvestorCalibration from "@/components/InvestorCalibration";
import InvestorSwipe from "@/components/InvestorSwipe";
import InvestorMatches from "@/components/InvestorMatches";
import PersonalizedRecommendations from "@/components/investor/PersonalizedRecommendations";
import EnhancedSubscriptionPlans from "@/components/enhanced/EnhancedSubscriptionPlans";
import AdvancedAnalytics from "@/components/enhanced/AdvancedAnalytics";
import SearchUsageCard from "./SearchUsageCard";
import RecentActivityCard from "./RecentActivityCard";

interface InvestorDashboardTabsProps {
  subscription: string;
  onCalibrationComplete: () => void;
}

const InvestorDashboardTabs = ({ 
  subscription, 
  onCalibrationComplete 
}: InvestorDashboardTabsProps) => {
  return (
    <Tabs defaultValue="discover" className="space-y-6">
      <TabsList className="bg-white border shadow-sm">
        <TabsTrigger value="discover">Discover</TabsTrigger>
        <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        <TabsTrigger value="matches">My Matches</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
            <SearchUsageCard subscription={subscription} />
            <RecentActivityCard />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="recommendations">
        <PersonalizedRecommendations />
      </TabsContent>

      <TabsContent value="matches">
        <InvestorMatches />
      </TabsContent>

      <TabsContent value="analytics">
        <AdvancedAnalytics 
          userType="investor" 
          subscription={subscription}
        />
      </TabsContent>

      <TabsContent value="preferences">
        <InvestorPreferences />
      </TabsContent>

      <TabsContent value="calibration">
        <InvestorCalibration onComplete={onCalibrationComplete} />
      </TabsContent>

      <TabsContent value="subscription">
        <EnhancedSubscriptionPlans currentPlan={subscription} userType="investor" />
      </TabsContent>
    </Tabs>
  );
};

export default InvestorDashboardTabs;
