
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Target, DollarSign, MapPin, TrendingUp } from "lucide-react";

const InvestorPreferences = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    sectors: [] as string[],
    stages: [] as string[],
    minInvestment: [100000],
    maxInvestment: [10000000],
    locations: [] as string[],
    riskTolerance: 'medium',
    revenueRequirement: false,
    teamSizeMin: [1],
    autoNotifications: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('investorPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('investorPreferences', JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your investment preferences have been updated successfully."
    });
  };

  const sectors = [
    'FinTech', 'HealthTech', 'EdTech', 'AI/ML', 'SaaS', 
    'E-commerce', 'BioTech', 'CleanTech', 'Gaming', 'Hardware'
  ];

  const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
  const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Seattle, WA', 'Remote'];

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Investment Preferences
          </CardTitle>
          <CardDescription>
            Configure your investment criteria to get better startup recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferred Sectors */}
          <div>
            <Label className="text-base font-medium mb-3 block">Preferred Sectors</Label>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <Badge
                  key={sector}
                  variant={preferences.sectors.includes(sector) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    preferences.sectors.includes(sector) 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    sectors: toggleArrayItem(prev.sectors, sector)
                  }))}
                >
                  {sector}
                </Badge>
              ))}
            </div>
          </div>

          {/* Investment Stages */}
          <div>
            <Label className="text-base font-medium mb-3 block">Investment Stages</Label>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <Badge
                  key={stage}
                  variant={preferences.stages.includes(stage) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    preferences.stages.includes(stage) 
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    stages: toggleArrayItem(prev.stages, stage)
                  }))}
                >
                  {stage}
                </Badge>
              ))}
            </div>
          </div>

          {/* Investment Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Minimum Investment: ${preferences.minInvestment[0].toLocaleString()}
              </Label>
              <Slider
                value={preferences.minInvestment}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, minInvestment: value }))}
                max={5000000}
                min={10000}
                step={10000}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-base font-medium mb-3 block">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Maximum Investment: ${preferences.maxInvestment[0].toLocaleString()}
              </Label>
              <Slider
                value={preferences.maxInvestment}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, maxInvestment: value }))}
                max={50000000}
                min={100000}
                step={100000}
                className="w-full"
              />
            </div>
          </div>

          {/* Risk Tolerance */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Risk Tolerance
            </Label>
            <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, riskTolerance: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={preferences.riskTolerance} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Established companies with proven revenue</SelectItem>
                <SelectItem value="medium">Medium - Growing companies with some traction</SelectItem>
                <SelectItem value="high">High - Early-stage with high growth potential</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Locations */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              <MapPin className="w-4 h-4 inline mr-1" />
              Preferred Locations
            </Label>
            <div className="flex flex-wrap gap-2">
              {locations.map((location) => (
                <Badge
                  key={location}
                  variant={preferences.locations.includes(location) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    preferences.locations.includes(location) 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    locations: toggleArrayItem(prev.locations, location)
                  }))}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="revenue-req">Require Existing Revenue</Label>
              <Switch
                id="revenue-req"
                checked={preferences.revenueRequirement}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, revenueRequirement: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-notifications">Auto Notifications for Matches</Label>
              <Switch
                id="auto-notifications"
                checked={preferences.autoNotifications}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoNotifications: checked }))}
              />
            </div>
          </div>

          <Button 
            onClick={savePreferences}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            size="lg"
          >
            <Target className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorPreferences;
