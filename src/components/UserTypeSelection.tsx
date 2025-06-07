
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, DollarSign } from "lucide-react";

interface UserTypeSelectionProps {
  userType: 'startup' | 'investor';
  onComplete: () => void;
}

const UserTypeSelection = ({ userType, onComplete }: UserTypeSelectionProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    sector: '',
    stage: '',
    ticketSize: '',
    description: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save form data to localStorage for demo purposes
    localStorage.setItem(`${userType}Profile`, JSON.stringify(formData));
    onComplete();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {userType === 'startup' ? 
              <Building2 className="w-8 h-8 text-white" /> : 
              <DollarSign className="w-8 h-8 text-white" />
            }
          </div>
          <CardTitle className="text-3xl font-bold">
            {userType === 'startup' ? 'Startup Registration' : 'Investor Registration'}
          </CardTitle>
          <CardDescription className="text-lg">
            {userType === 'startup' ? 
              'Join our marketplace to connect with the right investors for your startup' :
              'Discover and invest in the most promising startups'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company">
                {userType === 'startup' ? 'Startup Name' : 'Investment Firm/Company'}
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder={userType === 'startup' ? 'Your Startup' : 'Investment Firm'}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sector">Sector Focus</Label>
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
                <Label htmlFor="stage">
                  {userType === 'startup' ? 'Current Stage' : 'Investment Stage'}
                </Label>
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
            </div>

            <div>
              <Label htmlFor="ticketSize">
                {userType === 'startup' ? 'Funding Target' : 'Typical Investment Size'}
              </Label>
              <Select onValueChange={(value) => handleInputChange('ticketSize', value)}>
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

            <div>
              <Label htmlFor="description">
                {userType === 'startup' ? 'Brief Description' : 'Investment Philosophy'}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={userType === 'startup' ? 
                  'Describe your startup, product, and vision...' :
                  'Describe your investment approach and what you look for...'
                }
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
              size="lg"
            >
              Complete Registration
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTypeSelection;
