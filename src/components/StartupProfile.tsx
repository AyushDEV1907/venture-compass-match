
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Save, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StartupProfile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    company: '',
    description: '',
    sector: '',
    stage: '',
    fundingTarget: '',
    location: '',
    website: '',
    foundedYear: '',
    employees: '',
    revenue: '',
    teamMembers: [''],
    technologies: [''],
    businessModel: '',
    traction: '',
    competitors: '',
    useOfFunds: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('startupProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: 'teamMembers' | 'technologies') => {
    setProfile(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleArrayRemove = (field: 'teamMembers' | 'technologies', index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleArrayChange = (field: 'teamMembers' | 'technologies', index: number, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSave = () => {
    localStorage.setItem('startupProfile', JSON.stringify(profile));
    toast({
      title: "Profile Updated",
      description: "Your startup profile has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Startup Profile
          </CardTitle>
          <CardDescription>
            Complete your profile to attract the right investors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Your Startup Name"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your startup, mission, and what makes you unique..."
              rows={4}
            />
          </div>

          {/* Business Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sector">Sector</Label>
              <Select onValueChange={(value) => handleInputChange('sector', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="healthtech">HealthTech</SelectItem>
                  <SelectItem value="edtech">EdTech</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="ai">AI/ML</SelectItem>
                  <SelectItem value="biotech">BioTech</SelectItem>
                  <SelectItem value="cleantech">CleanTech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stage">Current Stage</Label>
              <Select onValueChange={(value) => handleInputChange('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c">Series C+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fundingTarget">Funding Target</Label>
              <Select onValueChange={(value) => handleInputChange('fundingTarget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100k">$0 - $100K</SelectItem>
                  <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                  <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                  <SelectItem value="10m+">$10M+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Company Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                value={profile.foundedYear}
                onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                placeholder="2023"
              />
            </div>
            <div>
              <Label htmlFor="employees">Team Size</Label>
              <Input
                id="employees"
                value={profile.employees}
                onChange={(e) => handleInputChange('employees', e.target.value)}
                placeholder="5-10"
              />
            </div>
            <div>
              <Label htmlFor="revenue">Monthly Revenue</Label>
              <Input
                id="revenue"
                value={profile.revenue}
                onChange={(e) => handleInputChange('revenue', e.target.value)}
                placeholder="$10,000"
              />
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Key Team Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleArrayAdd('teamMembers')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Member
              </Button>
            </div>
            <div className="space-y-2">
              {profile.teamMembers.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={member}
                    onChange={(e) => handleArrayChange('teamMembers', index, e.target.value)}
                    placeholder="Name, Title - Brief description"
                    className="flex-1"
                  />
                  {profile.teamMembers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleArrayRemove('teamMembers', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Technologies Used</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleArrayAdd('technologies')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Technology
              </Button>
            </div>
            <div className="space-y-2">
              {profile.technologies.map((tech, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tech}
                    onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                    placeholder="Technology, Framework, or Tool"
                    className="flex-1"
                  />
                  {profile.technologies.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleArrayRemove('technologies', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Business Model & Traction */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessModel">Business Model</Label>
              <Textarea
                id="businessModel"
                value={profile.businessModel}
                onChange={(e) => handleInputChange('businessModel', e.target.value)}
                placeholder="Describe how your startup makes money..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="traction">Key Traction Metrics</Label>
              <Textarea
                id="traction"
                value={profile.traction}
                onChange={(e) => handleInputChange('traction', e.target.value)}
                placeholder="Users, revenue growth, partnerships, etc..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="useOfFunds">Use of Funds</Label>
              <Textarea
                id="useOfFunds"
                value={profile.useOfFunds}
                onChange={(e) => handleInputChange('useOfFunds', e.target.value)}
                placeholder="How will you use the investment funding..."
                rows={3}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupProfile;
