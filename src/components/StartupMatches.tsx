
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChatModal from "./ChatModal";
import InvestorProfileModal from "./InvestorProfileModal";

interface Match {
  id: string;
  investor: {
    id: string;
    user_id: string;
    name: string;
    description: string;
    sectors: string[];
    stages: string[];
    ticket_size: string;
    location: string;
    portfolio: string;
    logo: string;
  };
  status: string;
  created_at: string;
}

const StartupMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return;

      // Get current user's startup
      const { data: startup, error: startupError } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (startupError) throw startupError;

      // Get matches for this startup
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          created_at,
          investor:investor_id (
            id,
            user_id,
            name,
            description,
            sectors,
            stages,
            ticket_size,
            location,
            portfolio,
            logo
          )
        `)
        .eq('startup_id', startup.id)
        .not('investor', 'is', null)
        .order('created_at', { ascending: false });

      if (matchesError) throw matchesError;

      setMatches(matchesData || []);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast({
        title: "Error",
        description: "Failed to load investor matches",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'declined': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Connected';
      case 'pending': return 'Interest Shown';
      case 'declined': return 'Declined';
      default: return 'New';
    }
  };

  const handleMessage = (investor: any) => {
    setSelectedInvestor(investor);
    setIsChatOpen(true);
  };

  const handleViewProfile = (investor: any) => {
    setSelectedInvestor(investor);
    setIsProfileOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-lg">
                        {match.investor.logo}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{match.investor.name}</h3>
                        <p className="text-muted-foreground">{match.investor.location}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(match.status)}>
                      {getStatusText(match.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Focus Areas</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.investor.sectors.slice(0, 3).map((sector: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ticket Size</p>
                      <p className="font-medium">{match.investor.ticket_size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Portfolio</p>
                      <p className="font-medium">{match.investor.portfolio}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      onClick={() => handleMessage(match.investor)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewProfile(match.investor)}
                    >
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

      {/* Chat Modal */}
      {selectedInvestor && (
        <ChatModal
          recipient={selectedInvestor}
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setSelectedInvestor(null);
          }}
        />
      )}

      {/* Profile Modal */}
      {selectedInvestor && (
        <InvestorProfileModal
          investor={selectedInvestor}
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
            setSelectedInvestor(null);
          }}
          onMessage={() => {
            setIsProfileOpen(false);
            setIsChatOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default StartupMatches;
