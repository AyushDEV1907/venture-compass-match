
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, MessageSquare, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  change: string;
}

interface InvestorStatsGridProps {
  stats?: {
    startups_reviewed: number;
    interested_matches: number;
    active_conversations: number;
    deals_in_pipeline: number;
  } | null;
  statsLoading: boolean;
}

const InvestorStatsGrid = ({ stats, statsLoading }: InvestorStatsGridProps) => {
  const staticStats: StatItem[] = [
    { label: 'Startups Reviewed', value: 127, icon: Eye, change: '+23' },
    { label: 'Interested Matches', value: 15, icon: Target, change: '+5' },
    { label: 'Active Conversations', value: 8, icon: MessageSquare, change: '+2' },
    { label: 'Deals in Pipeline', value: 3, icon: TrendingUp, change: '+1' }
  ];

  // Use real stats if available, otherwise fall back to static data
  const displayStats: StatItem[] = stats ? [
    { label: 'Startups Reviewed', value: stats.startups_reviewed, icon: Eye, change: '+23' },
    { label: 'Interested Matches', value: stats.interested_matches, icon: Target, change: '+5' },
    { label: 'Active Conversations', value: stats.active_conversations, icon: MessageSquare, change: '+2' },
    { label: 'Deals in Pipeline', value: stats.deals_in_pipeline, icon: TrendingUp, change: '+1' }
  ] : staticStats;

  return (
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
  );
};

export default InvestorStatsGrid;
