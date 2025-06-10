import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, Search, Filter, MapPin, TrendingUp, DollarSign, Star } from "lucide-react";
import { StartupData, InvestorData } from "@/types";
import StartupProfileModal from "@/components/StartupProfileModal";
import InvestorProfileModal from "@/components/InvestorProfileModal";
import ChatModal from "@/components/ChatModal";

const Marketplace = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'startups' | 'investors'>('startups');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState<StartupData | InvestorData | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<any>(null);

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
    }
  ];

  const demoInvestors: InvestorData[] = [
    {
      id: "1",
      name: "TechVentures Capital",
      description: "Early-stage venture capital firm focused on AI, SaaS, and emerging technologies with $50M AUM.",
      sectors: ["AI/ML", "SaaS", "FinTech"],
      stages: ["Seed", "Series A"],
      ticketSize: "$100K - $2M",
      location: "San Francisco, CA",
      portfolio: "25+ companies including 3 unicorns",
      logo: "💰"
    },
    {
      id: "2",
      name: "Green Impact Fund",
      description: "Impact investment fund specializing in climate tech and sustainable energy solutions.",
      sectors: ["CleanTech", "Energy", "Sustainability"],
      stages: ["Seed", "Series A", "Series B"],
      ticketSize: "$500K - $5M",
      location: "Boston, MA",
      portfolio: "15+ climate tech companies",
      logo: "🌍"
    },
    {
      id: "3",
      name: "Healthcare Innovation Partners",
      description: "Healthcare-focused investment firm backing the next generation of medical technology companies.",
      sectors: ["HealthTech", "BioTech", "MedTech"],
      stages: ["Pre-seed", "Seed", "Series A"],
      ticketSize: "$250K - $3M",
      location: "New York, NY",
      portfolio: "30+ healthcare companies",
      logo: "🏥"
    }
  ];

  const sectors = ["AI/ML", "FinTech", "HealthTech", "EdTech", "CleanTech", "SaaS", "E-commerce", "BioTech"];
  const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"];

  const filteredStartups = demoStartups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || startup.sector === sectorFilter;
    const matchesStage = stageFilter === 'all' || startup.stage === stageFilter;
    return matchesSearch && matchesSector && matchesStage;
  });

  const filteredInvestors = demoInvestors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || investor.sectors.includes(sectorFilter);
    const matchesStage = stageFilter === 'all' || investor.stages.includes(stageFilter);
    return matchesSearch && matchesSector && matchesStage;
  });

  const handleViewProfile = (profile: StartupData | InvestorData) => {
    setSelectedProfile(profile);
  };

  const handleSendMessage = (recipient: any) => {
    setChatRecipient(recipient);
    setShowChat(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Marketplace</h1>
                <p className="text-muted-foreground">
                  Discover {activeTab === 'startups' ? 'innovative startups' : 'strategic investors'}
                </p>
              </div>
            </div>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <Button
            onClick={() => setActiveTab('startups')}
            variant={activeTab === 'startups' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Startups
          </Button>
          <Button
            onClick={() => setActiveTab('investors')}
            variant={activeTab === 'investors' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Investors
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(stage => (
                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'startups' ? (
            filteredStartups.map((startup) => (
              <Card key={startup.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                        {startup.logo}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{startup.name}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                            {startup.sector}
                          </Badge>
                          <Badge variant="outline">{startup.stage}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {startup.description.substring(0, 120)}...
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{startup.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>{startup.revenue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{startup.teamSize} people</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{startup.fundingTarget}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleViewProfile(startup)}
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    <Button 
                      onClick={() => handleSendMessage(startup)}
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    >
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredInvestors.map((investor) => (
              <Card key={investor.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-xl">
                        {investor.logo}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{investor.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {investor.sectors.slice(0, 2).map(sector => (
                            <Badge key={sector} className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 text-xs">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {investor.description.substring(0, 120)}...
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{investor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{investor.ticketSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span>{investor.portfolio}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleViewProfile(investor)}
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    <Button 
                      onClick={() => handleSendMessage(investor)}
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white"
                    >
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* No Results */}
        {((activeTab === 'startups' && filteredStartups.length === 0) || 
          (activeTab === 'investors' && filteredInvestors.length === 0)) && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedProfile && (
        activeTab === 'startups' ? (
          <StartupProfileModal
            startup={selectedProfile as StartupData}
            isOpen={!!selectedProfile}
            onClose={() => setSelectedProfile(null)}
            onMessage={() => handleSendMessage(selectedProfile)}
          />
        ) : (
          <InvestorProfileModal
            investor={selectedProfile as InvestorData}
            isOpen={!!selectedProfile}
            onClose={() => setSelectedProfile(null)}
            onMessage={() => handleSendMessage(selectedProfile)}
          />
        )
      )}

      {showChat && chatRecipient && (
        <ChatModal
          recipient={chatRecipient}
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setChatRecipient(null);
          }}
        />
      )}
    </div>
  );
};

export default Marketplace;
