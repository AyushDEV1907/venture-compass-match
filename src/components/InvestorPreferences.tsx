
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Target, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InvestorPreferences = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    sectors: [] as string[],
    stages: [] as string[],
    ticketSizeMin: [100000],
    ticketSizeMax: [10000000],
    locations: [] as string[],
    investmentTimeframe: '',
    riskTolerance: '',
    followOnCapacity: false,
    leadInvestor: false,
    boardSeat: false
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem('investorPreferences');
    if (savedPreferences) {
      setPreferences(prev => ({ ...prev, ...JSON.parse(savedPreferences) }));
    }
  }, []);

  const sectors = [
    'FinTech', 'HealthTech', 'EdTech', 'SaaS', 'E-commerce', 
    'AI/ML', 'BioTech', 'CleanTech', 'Gaming', 'Enterprise'
  ];

  const stages = [
    'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Boston, MA', 'Austin, TX',
    'Seattle, WA', 'Los Angeles, CA', 'Chicago, IL', 'Remote/Global'
  ];

  const handleSectorToggle = (sector: string) => {
    setPreferences(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const handleStageToggle = (stage: string) => {
    setPreferences(prev => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter(s => s !== stage)
        : [...prev.stages, stage]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setPreferences(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleSave = () => {
    localStorage.setItem('investorPreferences', JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your investment preferences have been updated successfully.",
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Investment Preferences
          </CardTitle>
          <CardDescription>
            Configure your preferences to get better startup recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Sectors */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Preferred Sectors</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sectors.map(sector => (
                <div key={sector} className="flex items-center space-x-2">
                  <Checkbox
                    id={sector}
                    checked={preferences.sectors.includes(sector)}
                    onCheckedChange={() => handleSectorToggle(sector)}
                  />
                  <Label htmlFor={sector} className="text-sm font-normal cursor-pointer">
                    {sector}
                  </Label>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {preferences.sectors.map(sector => (
                <Badge key={sector} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stages */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Investment Stages</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stages.map(stage => (
                <div key={stage} className="flex items-center space-x-2">
                  <Checkbox
                    id={stage}
                    checked={preferences.stages.includes(stage)}
                    onCheckedChange={() => handleStageToggle(stage)}
                  />
                  <Label htmlFor={stage} className="text-sm font-normal cursor-pointer">
                    {stage}
                  </Label>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {preferences.stages.map(stage => (
                <Badge key={stage} variant="outline">
                  {stage}
                </Badge>
              ))}
            </div>
          </div>

          {/* Investment Size */}
          <div className="space-y-6">
            <Label className="text-base font-semibold">Investment Ticket Size</Label>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm">Minimum Investment</Label>
                <span className="text-sm font-medium">{formatCurrency(preferences.ticketSizeMin[0])}</span>
              </div>
              <Slider
                value={preferences.ticketSizeMin}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, ticketSizeMin: value }))}
                max={5000000}
                min={10000}
                step={10000}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm">Maximum Investment</Label>
                <span className="text-sm font-medium">{formatCurrency(preferences.ticketSizeMax[0])}</span>
              </div>
              <Slider
                value={preferences.ticketSizeMax}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, ticketSizeMax: value }))}
                max={50000000}
                min={100000}
                step={100000}
                className="w-full"
              />
            </div>
          </div>

          {/* Locations */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Preferred Locations</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {locations.map(location => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={location}
                    checked={preferences.locations.includes(location)}
                    onCheckedChange={() => handleLocationToggle(location)}
                  />
                  <Label htmlFor={location} className="text-sm font-normal cursor-pointer">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="timeframe" className="text-base font-semibold">Investment Timeframe</Label>
              <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, investmentTimeframe: value }))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-6months">3-6 months</SelectItem>
                  <SelectItem value="6-12months">6-12 months</SelectItem>
                  <SelectItem value="1-2years">1-2 years</SelectItem>
                  <SelectItem value="2+ years">2+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="risk" className="text-base font-semibold">Risk Tolerance</Label>
              <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, riskTolerance: value }))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                  <SelectItem value="very-aggressive">Very Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Investment Preferences */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Investment Style</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followOn"
                  checked={preferences.followOnCapacity}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, followOnCapacity: !!checked }))}
                />
                <Label htmlFor="followOn" className="text-sm font-normal cursor-pointer">
                  I have capacity for follow-on investments
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="leadInvestor"
                  checked={preferences.leadInvestor}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, leadInvestor: !!checked }))}
                />
                <Label htmlFor="leadInvestor" className="text-sm font-normal cursor-pointer">
                  Open to being a lead investor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="boardSeat"
                  checked={preferences.boardSeat}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, boardSeat: !!checked }))}
                />
                <Label htmlFor="boardSeat" className="text-sm font-normal cursor-pointer">
                  Interested in board seat opportunities
                </Label>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorPreferences;
