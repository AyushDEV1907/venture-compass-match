
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Target, Building2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvestorOnboardingProps {
  onComplete: () => void;
}

const InvestorOnboarding = ({ onComplete }: InvestorOnboardingProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    description: "",
    location: "",
    website: "",
    linkedinUrl: "",
    portfolio: "",
    ticketSize: "",
    preferredSectors: [] as string[],
    preferredStages: [] as string[],
    minInvestment: [50000],
    maxInvestment: [5000000],
    riskTolerance: 'medium',
    revenueRequirement: false,
    geographicFocus: [] as string[],
    investmentStyle: '',
    yearsExperience: '',
    notableInvestments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectors = [
    'FinTech', 'HealthTech', 'EdTech', 'AI/ML', 'SaaS', 
    'E-commerce', 'BioTech', 'CleanTech', 'Gaming', 'Hardware',
    'AgTech', 'PropTech', 'Cybersecurity', 'Retail Tech', 'FoodTech'
  ];

  const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
  
  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Boston, MA', 
    'Seattle, WA', 'Los Angeles, CA', 'Chicago, IL', 'London, UK', 
    'Berlin, Germany', 'Singapore', 'Remote/Global'
  ];

  const investmentStyles = [
    'Angel Investor', 'Venture Capital', 'Corporate VC', 'Family Office',
    'Accelerator/Incubator', 'Strategic Investor', 'Fund of Funds'
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.company || formData.preferredSectors.length === 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, company, and at least one preferred sector",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update investor profile
      const { error: updateError } = await supabase
        .from('investors')
        .update({
          name: formData.company,
          description: formData.description,
          sectors: formData.preferredSectors,
          stages: formData.preferredStages,
          ticket_size: formData.ticketSize,
          location: formData.location,
          portfolio: formData.portfolio
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update user profile
      await supabase
        .from('profiles')
        .update({
          name: formData.name,
          company: formData.company,
          description: formData.description,
          location: formData.location,
          sector: formData.preferredSectors[0] || '',
          stage: formData.preferredStages[0] || '',
          ticket_size: formData.ticketSize
        })
        .eq('id', user.id);

      // Save detailed preferences to localStorage
      localStorage.setItem('investorPreferences', JSON.stringify({
        sectors: formData.preferredSectors,
        stages: formData.preferredStages,
        minInvestment: formData.minInvestment,
        maxInvestment: formData.maxInvestment,
        riskTolerance: formData.riskTolerance,
        revenueRequirement: formData.revenueRequirement,
        locations: formData.geographicFocus,
        investmentStyle: formData.investmentStyle,
        yearsExperience: formData.yearsExperience
      }));

      toast({
        title: "Profile Updated! 💰",
        description: "Your investor profile has been successfully created."
      });

      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="w-6 h-6" />
            Complete Your Investor Profile
          </CardTitle>
          <p className="text-muted-foreground">
            Set up your investment preferences to get personalized startup recommendations.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="company">Company/Fund Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter your company or fund name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Investment Focus & Background</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your investment focus, background, and what you look for in startups..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <Label htmlFor="website">Website/LinkedIn</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          {/* Investment Style & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Investment Style</Label>
              <Select onValueChange={(value) => handleInputChange('investmentStyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select investment style" />
                </SelectTrigger>
                <SelectContent>
                  {investmentStyles.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="yearsExperience">Years of Investment Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                placeholder="5"
              />
            </div>
          </div>

          {/* Investment Preferences */}
          <div>
            <Label className="text-base font-medium mb-3 block">Preferred Sectors *</Label>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <Badge
                  key={sector}
                  variant={formData.preferredSectors.includes(sector) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.preferredSectors.includes(sector) 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleInputChange('preferredSectors', 
                    toggleArrayItem(formData.preferredSectors, sector)
                  )}
                >
                  {sector}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">Preferred Investment Stages</Label>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <Badge
                  key={stage}
                  variant={formData.preferredStages.includes(stage) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.preferredStages.includes(stage) 
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleInputChange('preferredStages', 
                    toggleArrayItem(formData.preferredStages, stage)
                  )}
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
                Minimum Investment: ${formData.minInvestment[0].toLocaleString()}
              </Label>
              <Slider
                value={formData.minInvestment}
                onValueChange={(value) => handleInputChange('minInvestment', value)}
                max={1000000}
                min={1000}
                step={1000}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-base font-medium mb-3 block">
                Maximum Investment: ${formData.maxInvestment[0].toLocaleString()}
              </Label>
              <Slider
                value={formData.maxInvestment}
                onValueChange={(value) => handleInputChange('maxInvestment', value)}
                max={50000000}
                min={100000}
                step={100000}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ticketSize">Typical Ticket Size</Label>
            <Input
              id="ticketSize"
              value={formData.ticketSize}
              onChange={(e) => handleInputChange('ticketSize', e.target.value)}
              placeholder="e.g., $50K - $500K"
            />
          </div>

          {/* Geographic Focus */}
          <div>
            <Label className="text-base font-medium mb-3 block">Geographic Focus</Label>
            <div className="flex flex-wrap gap-2">
              {locations.map((location) => (
                <Badge
                  key={location}
                  variant={formData.geographicFocus.includes(location) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.geographicFocus.includes(location) 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleInputChange('geographicFocus', 
                    toggleArrayItem(formData.geographicFocus, location)
                  )}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>

          {/* Risk Tolerance */}
          <div>
            <Label className="text-base font-medium mb-3 block">Risk Tolerance</Label>
            <Select onValueChange={(value) => handleInputChange('riskTolerance', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Conservative - Established companies with proven revenue</SelectItem>
                <SelectItem value="medium">Moderate - Growing companies with some traction</SelectItem>
                <SelectItem value="high">Aggressive - Early-stage with high growth potential</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="revenue-req">Require Existing Revenue</Label>
              <Switch
                id="revenue-req"
                checked={formData.revenueRequirement}
                onCheckedChange={(checked) => handleInputChange('revenueRequirement', checked)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="portfolio">Notable Investments/Portfolio</Label>
            <Textarea
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              placeholder="List notable investments or portfolio companies..."
              className="min-h-[60px]"
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            size="lg"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Target className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Saving...' : 'Complete Profile Setup'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorOnboarding;
