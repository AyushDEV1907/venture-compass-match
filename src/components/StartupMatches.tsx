
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Users, Mail, Calendar } from "lucide-react";

const StartupMatches = () => {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    // Simulate some interested investors
    const demoMatches = [
      {
        id: 1,
        name: "TechVentures Capital",
        partner: "Sarah Chen",
        focusAreas: ["AI/ML", "SaaS"],
        ticketSize: "$1M - $5M",
        portfolio: "50+ startups",
        status: "interested",
        matchDate: "2024-01-10"
      },
      {
        id: 2,
        name: "InnovateVC",
        partner: "Michael Rodriguez",
        focusAreas: ["FinTech", "Enterprise"],
        ticketSize: "$500K - $2M",
        portfolio: "30+ startups",
        status: "interested",
        matchDate: "2024-01-08"
      },
      {
        id: 3,
        name: "Future Fund",
        partner: "Emily Watson",
        focusAreas: ["CleanTech", "HealthTech"],
        ticketSize: "$2M - $10M",
        portfolio: "25+ startups",
        status: "messaged",
        matchDate: "2024-01-05"
      }
    ];
    setMatches(demoMatches);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interested': return 'bg-green-100 text-green-700';
      case 'messaged': return 'bg-blue-100 text-blue-700';
      case 'meeting': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'interested': return 'Interested';
      case 'messaged': return 'In Conversation';
      case 'meeting': return 'Meeting Scheduled';
      default: return 'New';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Investor Matches
          </CardTitle>
          <CardDescription>
            Investors who have shown interest in your startup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No matches yet. Complete your profile to attract investors!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{match.name}</h3>
                      <p className="text-muted-foreground">Partner: {match.partner}</p>
                    </div>
                    <Badge className={getStatusColor(match.status)}>
                      {getStatusText(match.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Focus Areas</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.focusAreas.map((area: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ticket Size</p>
                      <p className="font-medium">{match.ticketSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Portfolio</p>
                      <p className="font-medium">{match.portfolio}</p>
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
                      Schedule Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Tips */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-blue-700">Tips for Better Matches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Complete your profile with detailed financials and metrics</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Upload a compelling pitch deck with clear value proposition</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Respond quickly to investor messages to maintain momentum</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Keep your traction metrics updated regularly</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupMatches;
