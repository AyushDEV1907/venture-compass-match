
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, MessageSquare, TrendingUp } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  change: string;
}

interface DashboardStatsProps {
  stats: any;
  statsLoading: boolean;
}

const DashboardStats = ({ stats, statsLoading }: DashboardStatsProps) => {
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

export default DashboardStats;
