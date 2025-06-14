
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Zap, Crown, Star, TrendingUp, Users, MessageSquare, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedSubscriptionPlansProps {
  currentPlan: string;
  userType: 'startup' | 'investor';
}

const EnhancedSubscriptionPlans = ({ currentPlan, userType }: EnhancedSubscriptionPlansProps) => {
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startupPlans = [
    {
      id: 'free',
      name: 'Starter',
      icon: Star,
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for getting started',
      features: [
        '1 pitch deck upload',
        'Basic profile visibility',
        '5 investor views per month',
        'Basic analytics',
        'Community support'
      ],
      limitations: [
        'Limited visibility',
        'No priority listing',
        'Basic matching'
      ]
    },
    {
      id: 'pro',
      name: 'Growth',
      icon: TrendingUp,
      monthlyPrice: 49,
      annualPrice: 39,
      description: 'Ideal for scaling startups',
      features: [
        'Unlimited pitch deck updates',
        'Enhanced profile with media',
        '50 investor connections/month',
        'Advanced analytics & insights',
        'Priority customer support',
        'Investor engagement tracking',
        'Custom branding options'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Enterprise',
      icon: Crown,
      monthlyPrice: 149,
      annualPrice: 119,
      description: 'For established startups seeking investment',
      features: [
        'Everything in Growth',
        'Unlimited investor connections',
        'Featured listing placement',
        'Personal success manager',
        'Advanced AI matching',
        'Investor introduction service',
        'Pitch deck review service',
        'Market intelligence reports'
      ]
    }
  ];

  const investorPlans = [
    {
      id: 'free',
      name: 'Explorer',
      icon: Star,
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Try our platform',
      features: [
        '5 startup views per month',
        'Basic filtering',
        'Limited messaging',
        'Basic analytics',
        'Community access'
      ],
      limitations: [
        'Limited deal flow',
        'No advanced filters',
        'Basic support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      icon: TrendingUp,
      monthlyPrice: 99,
      annualPrice: 79,
      description: 'For active angel investors',
      features: [
        '100 startup views/month',
        'Advanced filtering & search',
        'Unlimited messaging',
        'Portfolio tracking',
        'Deal flow analytics',
        'Investment tracking tools',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Institutional',
      icon: Crown,
      monthlyPrice: 299,
      annualPrice: 239,
      description: 'For VCs and institutions',
      features: [
        'Unlimited startup access',
        'Advanced AI recommendations',
        'Team collaboration tools',
        'Custom deal sourcing',
        'White-label options',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Proprietary market insights'
      ]
    }
  ];

  const plans = userType === 'startup' ? startupPlans : investorPlans;

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('subscription', planId);
      
      toast({
        title: "Plan Updated! 🎉",
        description: `Successfully upgraded to ${planId} plan.`
      });
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "There was an error processing your upgrade. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <span className={`text-sm ${isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
          Annual
        </span>
        {isAnnual && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Save 20%
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
              plan.popular ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            } ${currentPlan === plan.id ? 'bg-gradient-to-br from-blue-50 to-purple-50' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <plan.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              
              <div className="pt-4">
                <div className="text-4xl font-bold">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
                {isAnnual && plan.monthlyPrice > 0 && (
                  <div className="text-sm text-muted-foreground line-through">
                    ${plan.monthlyPrice}/month
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">• {limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4">
                {currentPlan === plan.id ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isLoading}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.monthlyPrice === 0 ? 'Get Started' : 'Upgrade'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>
            Compare all features across our {userType} plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center py-2 min-w-[120px]">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {userType === 'startup' ? (
                  <>
                    <tr className="border-b">
                      <td className="py-3">Monthly {userType === 'startup' ? 'investor views' : 'startup views'}</td>
                      <td className="text-center">5</td>
                      <td className="text-center">50</td>
                      <td className="text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Priority listing</td>
                      <td className="text-center">-</td>
                      <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Advanced analytics</td>
                      <td className="text-center">-</td>
                      <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b">
                      <td className="py-3">Monthly startup views</td>
                      <td className="text-center">5</td>
                      <td className="text-center">100</td>
                      <td className="text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Advanced filtering</td>
                      <td className="text-center">-</td>
                      <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                      <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">AI recommendations</td>
                      <td className="text-center">Basic</td>
                      <td className="text-center">Advanced</td>
                      <td className="text-center">Premium</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSubscriptionPlans;
