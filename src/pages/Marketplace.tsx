
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Building2, Users, Search, Filter, MapPin, DollarSign, TrendingUp, Star, Eye, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const [userType, setUserType] = useState<'startup' | 'investor' | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as 'startup' | 'investor' | null;
    setUserType(savedUserType);
  }, []);

  const sectors = ["AI/ML", "FinTech", "HealthTech", "EdTech", "CleanTech", "E-commerce", "SaaS", "Enterprise"];
  const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"];

  const startups = [
    {
      id: 1,
      name: "TechFlow AI",
      description: "Revolutionary AI-powered workflow automation platform that helps businesses streamline operations.",
      sector: "AI/ML",
      stage: "Series A",
      fundingTarget: "$2M",
      location: "San Francisco, CA",
      teamSize: 12,
      revenue: "$50K MRR",
      traction: "500+ enterprise customers",
      logo: "🤖",
      featured: true
    },
    {
      id: 2,
      name: "EcoCharge",
      description: "Sustainable energy startup developing next-generation solar panel technology.",
      sector: "CleanTech",
      stage: "Seed",
      fundingTarget: "$1.5M",
      location: "Austin, TX",
      teamSize: 8,
      revenue: "$25K MRR",
      traction: "50+ installations",
      logo: "🌱",
      featured: false
    },
    {
      id: 3,
      name: "MedLink Pro",
      description: "Telemedicine platform connecting patients with specialists globally.",
      sector: "HealthTech",
      stage: "Series A",
      fundingTarget: "$3M",
      location: "Boston, MA",
      teamSize: 25,
      revenue: "$120K MRR",
      traction: "10K+ patients served",
      logo: "🏥",
      featured: true
    },
    {
      id: 4,
      name: "FinSecure",
      description: "Blockchain-based financial security platform for digital transactions.",
      sector: "FinTech",
      stage: "Pre-seed",
      fundingTarget: "$500K",
      location: "New York, NY",
      teamSize: 4,
      revenue: "$8K MRR",
      traction: "20+ financial institutions",
      logo: "🔒",
      featured: false
    }
  ];

  const investors = [
    {
      id: 1,
      name: "TechVentures Capital",
      partner: "Sarah Chen",
      focusAreas: ["AI/ML", "SaaS"],
      ticketSize: "$1M - $5M",
      portfolio: "50+ startups",
      location: "Silicon Valley, CA",
      logo: "💼",
      featured: true
    },
    {
      id: 2,
      name: "InnovateVC",
      partner: "Michael Rodriguez",
      focusAreas: ["FinTech", "Enterprise"],
      ticketSize: "$500K - $2M",
      portfolio: "30+ startups",
      location: "New York, NY",
      logo: "🚀",
      featured: false
    },
    {
      id: 3,
      name: "Future Fund",
      partner: "Emily Watson",
      focusAreas: ["CleanTech", "HealthTech"],
      ticketSize: "$2M - $10M",
      portfolio: "25+ startups",
      location: "Boston, MA",
      logo: "🌟",
      featured: true
    }
  ];

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(startup.sector);
    return matchesSearch && matchesSector;
  });

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.partner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSectors.length === 0 || 
                         investor.focusAreas.some(area => selectedSectors.includes(area));
    return matchesSearch && matchesSector;
  });

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Marketplace</h1>
                <p className="text-muted-foreground">Discover opportunities and connections</p>
              </div>
            </div>
            <Badge 
              className={`${
                userType === 'startup' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                'bg-gradient-to-r from-green-600 to-blue-600'
              } text-white border-0`}
            >
              {userType === 'startup' ? 'Startup View' : 'Investor View'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={`Search ${userType === 'startup' ? 'investors' : 'startups'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-3">Filter by Sector</p>
              <div className="flex flex-wrap gap-2">
                {sectors.map((sector) => (
                  <Button
                    key={sector}
                    variant={selectedSectors.includes(sector) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSector(sector)}
                    className={selectedSectors.includes(sector) ? 
                      "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""
                    }
                  >
                    {sector}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue={userType === 'startup' ? 'investors' : 'startups'} className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="startups" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Startups ({filteredStartups.length})
            </TabsTrigger>
            <TabsTrigger value="investors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Investors ({filteredInvestors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="startups" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStartups.map((startup) => (
                <Card key={startup.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                          {startup.logo}
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {startup.name}
                            {startup.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          </CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                              {startup.sector}
                            </Badge>
                            <Badge variant="outline">{startup.stage}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-4">
                      {startup.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Seeking</p>
                          <p className="text-sm font-medium">{startup.fundingTarget}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="text-sm font-medium">{startup.revenue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium">{startup.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Team</p>
                          <p className="text-sm font-medium">{startup.teamSize} people</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm"><strong>Traction:</strong> {startup.traction}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="investors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInvestors.map((investor) => (
                <Card key={investor.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-xl">
                          {investor.logo}
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {investor.name}
                            {investor.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          </CardTitle>
                          <p className="text-muted-foreground">Partner: {investor.partner}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Focus Areas</p>
                      <div className="flex flex-wrap gap-1">
                        {investor.focusAreas.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Ticket Size</p>
                          <p className="text-sm font-medium">{investor.ticketSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Portfolio</p>
                          <p className="text-sm font-medium">{investor.portfolio}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <p className="text-sm">{investor.location}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured Section */}
        <Card className="border-0 shadow-lg mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Star className="w-5 h-5" />
              Featured This Week
            </CardTitle>
            <CardDescription>
              Hand-picked opportunities from our curation team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userType === 'startup' && (
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold">🌟 TechVentures Capital</h4>
                  <p className="text-sm text-muted-foreground">Leading AI/ML investor with $100M+ deployed</p>
                </div>
              )}
              {userType === 'investor' && (
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold">🚀 TechFlow AI</h4>
                  <p className="text-sm text-muted-foreground">Fast-growing AI startup with 300% YoY growth</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Marketplace;
