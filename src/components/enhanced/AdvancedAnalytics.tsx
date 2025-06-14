
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, MessageSquare, Target, Users, DollarSign, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  profileViews: number;
  matches: number;
  messages: number;
  conversionRate: number;
  viewsLastWeek: Array<{ day: string; views: number; matches: number }>;
  sectorInterest: Array<{ sector: string; count: number; percentage: number }>;
  stageDistribution: Array<{ stage: string; count: number }>;
}

interface AdvancedAnalyticsProps {
  userType: 'startup' | 'investor';
  subscription: string;
  data?: AnalyticsData;
}

const AdvancedAnalytics = ({ userType, subscription, data }: AdvancedAnalyticsProps) => {
  // Demo data for visualization
  const demoData: AnalyticsData = {
    profileViews: 127,
    matches: 15,
    messages: 42,
    conversionRate: 11.8,
    viewsLastWeek: [
      { day: 'Mon', views: 12, matches: 2 },
      { day: 'Tue', views: 19, matches: 1 },
      { day: 'Wed', views: 8, matches: 3 },
      { day: 'Thu', views: 22, matches: 4 },
      { day: 'Fri', views: 15, matches: 2 },
      { day: 'Sat', views: 9, matches: 1 },
      { day: 'Sun', views: 11, matches: 2 }
    ],
    sectorInterest: [
      { sector: 'FinTech', count: 45, percentage: 35.4 },
      { sector: 'HealthTech', count: 32, percentage: 25.2 },
      { sector: 'AI/ML', count: 28, percentage: 22.0 },
      { sector: 'SaaS', count: 22, percentage: 17.3 }
    ],
    stageDistribution: [
      { stage: 'Seed', count: 8 },
      { stage: 'Series A', count: 5 },
      { stage: 'Pre-seed', count: 2 }
    ]
  };

  const analyticsData = data || demoData;
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend 
  }: { 
    title: string; 
    value: string | number; 
    change?: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                <span className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (subscription === 'free') {
    return (
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <TrendingUp className="w-5 h-5" />
            Advanced Analytics
          </CardTitle>
          <CardDescription>
            Upgrade to Pro or Premium for detailed analytics and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unlock Powerful Analytics</h3>
            <p className="text-muted-foreground mb-4">
              Get detailed insights into your {userType === 'startup' ? 'investor engagement' : 'deal flow'} with our advanced analytics.
            </p>
            <Badge className="bg-orange-100 text-orange-800">
              Available in Pro & Premium plans
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title={userType === 'startup' ? 'Profile Views' : 'Startups Reviewed'}
          value={analyticsData.profileViews}
          change="+23%"
          trend="up"
          icon={Eye}
        />
        <MetricCard
          title="Matches"
          value={analyticsData.matches}
          change="+12%"
          trend="up"
          icon={Target}
        />
        <MetricCard
          title="Messages"
          value={analyticsData.messages}
          change="+8%"
          trend="up"
          icon={MessageSquare}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analyticsData.conversionRate}%`}
          change="+2.1%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>
              {userType === 'startup' ? 'Profile views and matches' : 'Startup reviews and matches'} over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.viewsLastWeek}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="matches" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Matches"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Interest */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>
              {userType === 'startup' ? 'Investor Interest by Sector' : 'Sector Preferences'}
            </CardTitle>
            <CardDescription>
              Distribution of {userType === 'startup' ? 'investor views' : 'your interests'} by sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.sectorInterest}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ sector, percentage }) => `${sector} ${percentage}%`}
                >
                  {analyticsData.sectorInterest.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Premium Analytics */}
      {subscription === 'premium' && (
        <>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Stage Distribution</CardTitle>
              <CardDescription>
                {userType === 'startup' ? 'Investor preferences' : 'Your portfolio'} by investment stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.stageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">8.4/10</div>
                <p className="text-sm text-muted-foreground">Above average</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Best Performing Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">Thursday</div>
                <p className="text-sm text-muted-foreground">22 views, 4 matches</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">73%</div>
                <p className="text-sm text-muted-foreground">Message response rate</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
