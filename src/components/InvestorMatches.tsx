
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Building2, Calendar, DollarSign, TrendingUp } from "lucide-react";

const InvestorMatches = () => {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    // Load matches from localStorage (these would come from swipe interactions)
    const savedMatches = JSON.parse(localStorage.getItem('investorMatches') || '[]');
    setMatches(savedMatches);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-green-100 text-green-700';
      case 'meeting': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Startup Matches
          </CardTitle>
          <CardDescription>
            Startups you've shown interest in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No matches yet. Start swiping to find interesting startups!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                        {match.logo || "🚀"}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{match.name}</h3>
                        <p className="text-muted-foreground">{match.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      New Match
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Sector</p>
                      <Badge variant="outline" className="mt-1">
                        {match.sector}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stage</p>
                      <p className="font-medium">{match.stage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seeking</p>
                      <p className="font-medium">{match.fundingTarget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="font-medium">{match.revenue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Tips */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-green-700">Investment Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Review financial metrics and growth trends carefully</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Schedule due diligence calls to assess team and market fit</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Consider portfolio diversification and investment thesis alignment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorMatches;
