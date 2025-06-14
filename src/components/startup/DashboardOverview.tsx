
import { TabsContent } from "@/components/ui/tabs";
import QuickActionsCard from "./QuickActionsCard";
import InvestmentReadinessCard from "./InvestmentReadinessCard";

const DashboardOverview = () => {
  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsCard />
        <InvestmentReadinessCard />
      </div>
    </TabsContent>
  );
};

export default DashboardOverview;
