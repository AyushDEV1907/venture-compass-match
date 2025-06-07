
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Star, Zap, Crown, ArrowRight } from "lucide-react";

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
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Star,
      features: [
        userType === 'investor' ? '5 startup views per month' : '5 investor views per month',
        'Basic matching algorithm',
        'Standard profile',
        'Email support',
        'Basic analytics'
      ],
      limitations: [
        'Limited matches',
        'No priority support',
        'Basic features only'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For serious networking',
      icon: Zap,
      popular: true,
      features: [
        userType === 'investor' ? '50 startup views per month' : '50 investor views per month',
        'Advanced AI matching',
        'Priority in search results',
        'Advanced analytics dashboard',
        'Direct messaging',
        'Email & chat support',
        'Pitch deck upload (startups)',
        'Due diligence tools (investors)'
      ],
      limitations: []
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99',
      period: 'per month',
      description: 'Maximum growth potential',
      icon: Crown,
      features: [
        'Unlimited views and matches',
        'AI-powered recommendations',
        'Featured profile placement',
        'Advanced analytics & insights',
        'Priority customer support',
        'Custom pitch presentations',
        'Investment tracking tools',
        'Network introduction services',
        'Exclusive events access'
      ],
      limitations: []
    }
  ];

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    
    // Simulate upgrade process
    setTimeout(() => {
      localStorage.setItem('subscription', planId);
      setIsUpgrading(false);
      
      toast({
        title: "Plan Upgraded! 🎉",
        description: `You've successfully upgraded to ${plans.find(p => p.id === planId)?.name}. Enjoy your new features!`
      });
      
      // Refresh the page to show updated plan
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground text-lg">
          Unlock more features and get better matches with our premium plans
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          
          return (
            <Card 
              key={plan.id} 
              className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              } ${isCurrentPlan ? 'bg-gradient-to-br from-blue-50 to-purple-50' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  plan.id === 'free' ? 'bg-gradient-to-r from-gray-600 to-gray-700' :
                  plan.id === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                  'bg-gradient-to-r from-purple-600 to-pink-600'
                }`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">Included Features</h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-700">Limitations</h4>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 border border-orange-300 rounded mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button disabled className="w-full" size="lg">
                      <Check className="w-4 h-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isUpgrading}
                      className={`w-full ${
                        plan.id === 'free' ? 'bg-gradient-to-r from-gray-600 to-gray-700' :
                        plan.id === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                        'bg-gradient-to-r from-purple-600 to-pink-600'
                      } text-white hover:opacity-90`}
                      size="lg"
                    >
                      {isUpgrading ? (
                        "Processing..."
                      ) : (
                        <>
                          {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Need a Custom Solution?</h3>
            <p className="text-muted-foreground mb-4">
              For enterprise customers or special requirements, we offer custom pricing and features.
            </p>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
