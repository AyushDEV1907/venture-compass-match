
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Building2, DollarSign, MapPin, Users, TrendingUp, Heart, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { StartupData, InvestorData } from "@/types";

const Marketplace = () => {
  const [userType, setUserType] = useState<'startup' | 'investor' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState<(StartupData | InvestorData)[]>([]);

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as 'startup' | 'investor' | null;
    setUserType(savedUserType);
  }, []);

  const startups: StartupData[] = [
    {
      id: 1,
      name: "TechFlow AI",
      description: "Revolutionary AI-powered workflow automation platform that helps businesses streamline operations.",
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
      id: 2,
      name: "EcoCharge",
      description: "Sustainable energy startup developing next-generation solar panel technology.",
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
      id: 3,
      name: "MedLink Pro",
      description: "Telemedicine platform connecting patients with specialists globally.",
      sector: "HealthTech",
      stage: "Series A",
      fundingTarget: "$3M",
      location: "Boston, MA",
      teamSize: "25",
      revenue: "$120K MRR",
      traction: "10K+ patients served, 200+ doctors on platform",
      logo: "🏥"
    }
  ];

  const investors: InvestorData[] = [
    {
      id: 1,
      name: "Venture Partners",
      description: "Early-stage VC focused on AI and machine learning startups.",
      sectors: ["AI/ML", "SaaS"],
      stages: ["Seed", "Series A"],
      ticketSize: "$500K - $2M",
      location: "San Francisco, CA",
      portfolio: "50+ companies",
      logo: "💰"
    },
    {
      id: 2,
      name: "Green Horizon Fund",
      description: "Impact investor specializing in sustainable technology and clean energy.",
      sectors: ["CleanTech", "Sustainability"],
      stages: ["Seed", "Series A", "Series B"],
      ticketSize: "$1M - $5M",
      location: "Seattle, WA",
      portfolio: "30+ companies",
      logo: "🌿"
    },
    {
      id: 3,
      name: "HealthTech Ventures",
      description: "Healthcare-focused investment firm backing innovative medical technologies.",
      sectors: ["HealthTech", "BioTech"],
      stages: ["Pre-seed", "Seed", "Series A"],
      ticketSize: "$250K - $3M",
      location: "Boston, MA",
      portfolio: "75+ companies",
      logo: "⚕️"
    }
  ];

  useEffect(() => {
    const items = userType === 'startup' ? investors : startups;
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sectorFilter !== "all") {
      filtered = filtered.filter(item => {
        if (userType === 'startup') {
          // For investors, check if they invest in the selected sector
          const investor = item as InvestorData;
          return investor.sectors.includes(sectorFilter);
        } else {
          // For startups, check their sector
          const startup = item as StartupData;
          return startup.sector === sectorFilter;
        }
      });
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter(item => {
        if (userType === 'startup') {
          // For investors, check if they invest in the selected stage
          const investor = item as InvestorData;
          return investor.stages.includes(stageFilter);
        } else {
          // For startups, check their stage
          const startup = item as StartupData;
          return startup.stage === stageFilter;
        }
      });
    }

    setFilteredItems(filtered);
  }, [searchTerm, sectorFilter, stageFilter, userType]);

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
            <p className="text-muted-foreground mb-4">Please sign in to access the marketplace.</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Go to Home
              </Button>
            </Link>
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
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  {userType === 'startup' ? <DollarSign className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
                </div>
                <h1 className="text-2xl font-bold">
                  {userType === 'startup' ? 'Find Investors' : 'Discover Startups'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={`Search ${userType === 'startup' ? 'investors' : 'startups'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select onValueChange={setSectorFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                  <SelectItem value="HealthTech">HealthTech</SelectItem>
                  <SelectItem value="CleanTech">CleanTech</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setStageFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B">Series B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isInvestor = userType === 'startup';
            const investor = isInvestor ? item as InvestorData : null;
            const startup = !isInvestor ? item as StartupData : null;

            return (
              <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                      {item.logo}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        {isInvestor && investor ? (
                          <>
                            {investor.sectors.map((sector: string) => (
                              <Badge key={sector} variant="outline" className="text-xs">
                                {sector}
                              </Badge>
                            ))}
                          </>
                        ) : startup ? (
                          <>
                            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                              {startup.sector}
                            </Badge>
                            <Badge variant="outline">{startup.stage}</Badge>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {isInvestor && investor ? (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span>Ticket Size: {investor.ticketSize}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>Portfolio: {investor.portfolio}</span>
                        </div>
                      </>
                    ) : startup ? (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span>Revenue: {startup.revenue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>Team: {startup.teamSize} people</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-purple-600" />
                          <span>Seeking: {startup.fundingTarget}</span>
                        </div>
                      </>
                    ) : null}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Heart className="w-4 h-4 mr-2" />
                      Interested
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters to find more results.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
