
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlansProps {
  currentPlan: string;
  userType: 'startup' | 'investor';
}

const SubscriptionPlans = ({ currentPlan, userType }: SubscriptionPlansProps) => {
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      icon: Star,
      description: 'Perfect for getting started',
      features: userType === 'startup' ? [
        '1 pitch deck upload',
        '5 investor connections/month',
        'Basic profile creation',
        'Standard support',
        'Public listing'
      ] : [
        '5 startup reviews/month',
        'Basic matching algorithm',
        'Standard profile',
        'Basic search filters',
        'Community support'
      ],
      buttonText: 'Current Plan',
      highlighted: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: '/month',
      icon: Zap,
      description: 'For serious professionals',
      features: userType === 'startup' ? [
        '5 pitch deck uploads',
        '50 investor connections/month',
        'Advanced profile features',
        'Priority support',
        'Featured listing',
        'Basic analytics',
        'Direct messaging'
      ] : [
        '50 startup reviews/month',
        'Advanced matching algorithm',
        'Enhanced profile features',
        'Advanced search filters',
        'Priority support',
        'Saved searches',
        'Email notifications'
      ],
      buttonText: 'Upgrade to Pro',
      highlighted: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99',
      period: '/month',
      icon: Crown,
      description: 'Maximum potential unlocked',
      features: userType === 'startup' ? [
        'Unlimited pitch deck uploads',
        'Unlimited investor connections',
        'Premium profile features',
        'White-glove support',
        'Top-tier listing',
        'Advanced analytics & insights',
        'Video calls integration',
        'Custom branding',
        'API access'
      ] : [
        'Unlimited startup reviews',
        'AI-powered recommendations',
        'Premium profile features',
        'All search capabilities',
        'White-glove support',
        'Deal flow analytics',
        'Custom deal alerts',
        'Portfolio tracking',
        'API access'
      ],
      buttonText: 'Upgrade to Premium',
      highlighted: false
    }
  ];

  const handleUpgrade = (planId: string) => {
    setIsUpgrading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      localStorage.setItem('subscription', planId);
      setIsUpgrading(false);
      toast({
        title: "Plan Upgraded! 🎉",
        description: `You've successfully upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)}!`,
      });
      // In a real app, this would reload the page or update the parent component
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-xl text-muted-foreground">
          {userType === 'startup' 
            ? 'Unlock more investor connections and advanced features'
            : 'Discover more startups and get better matching'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          
          return (
            <Card 
              key={plan.id} 
              className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.highlighted ? 'ring-2 ring-blue-600 scale-105' : ''
              } ${isCurrentPlan ? 'bg-gradient-to-br from-blue-50 to-purple-50' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
                    Current
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  plan.highlighted 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700'
                }`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-lg">{plan.description}</CardDescription>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => !isCurrentPlan && handleUpgrade(plan.id)}
                  disabled={isCurrentPlan || isUpgrading}
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : isCurrentPlan
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                  }`}
                  size="lg"
                >
                  {isUpgrading ? 'Processing...' : isCurrentPlan ? 'Current Plan' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>See what's included in each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Feature</th>
                  <th className="text-center py-3">Free</th>
                  <th className="text-center py-3">Pro</th>
                  <th className="text-center py-3">Premium</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-3">{userType === 'startup' ? 'Investor Connections' : 'Startup Reviews'}</td>
                  <td className="text-center py-3">5/month</td>
                  <td className="text-center py-3">50/month</td>
                  <td className="text-center py-3">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Advanced Analytics</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3">✅</td>
                  <td className="text-center py-3">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Priority Support</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3">✅</td>
                  <td className="text-center py-3">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">API Access</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3">❌</td>
                  <td className="text-center py-3">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
