
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Heart, X, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvestorCalibrationProps {
  onComplete: () => void;
}

const InvestorCalibration = ({ onComplete }: InvestorCalibrationProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<boolean[]>([]);

  const calibrationStartups = [
    {
      name: "GreenEnergy Solutions",
      sector: "CleanTech",
      stage: "Seed",
      funding: "$1.2M",
      description: "Solar panel efficiency optimization using AI algorithms",
      metrics: "50% cost reduction, 25% efficiency gain"
    },
    {
      name: "HealthBot AI",
      sector: "HealthTech",
      stage: "Series A",
      funding: "$3.5M",
      description: "AI-powered diagnostic assistant for rural healthcare",
      metrics: "89% diagnostic accuracy, 10K+ patients served"
    },
    {
      name: "FinSecure Pro",
      sector: "FinTech",
      stage: "Pre-seed",
      funding: "$800K",
      description: "Blockchain-based fraud detection for small businesses",
      metrics: "99.7% fraud detection rate, 200+ businesses onboarded"
    },
    {
      name: "EduVR Platform",
      sector: "EdTech",
      stage: "Seed",
      funding: "$2.1M",
      description: "Virtual reality learning experiences for STEM education",
      metrics: "300+ schools, 95% student engagement increase"
    },
    {
      name: "AutoFleet Manager",
      sector: "SaaS",
      stage: "Series A",
      funding: "$4.2M",
      description: "Fleet management platform with predictive maintenance",
      metrics: "$50K ARR, 40% cost savings for clients"
    }
  ];

  const currentStartup = calibrationStartups[currentIndex];
  const progress = ((currentIndex + 1) / calibrationStartups.length) * 100;

  const handleResponse = (interested: boolean) => {
    const newResponses = [...responses, interested];
    setResponses(newResponses);

    if (currentIndex === calibrationStartups.length - 1) {
      // Complete calibration
      localStorage.setItem('investorCalibrated', 'true');
      localStorage.setItem('calibrationResponses', JSON.stringify(newResponses));
      
      toast({
        title: "Calibration Complete! 🎯",
        description: "We've learned your preferences and will provide better recommendations.",
      });
      
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (responses.length === calibrationStartups.length) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Calibration Complete!</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for reviewing these startups. We'll use your preferences to provide better recommendations.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{responses.filter(r => r).length}</div>
              <div className="text-sm text-muted-foreground">Interested</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{responses.filter(r => !r).length}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Preference Calibration
          </CardTitle>
          <CardDescription>
            Review these 5 demo startups to help us understand your investment preferences
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{currentIndex + 1} of {calibrationStartups.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{currentStartup.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  {currentStartup.sector}
                </Badge>
                <Badge variant="outline">{currentStartup.stage}</Badge>
                <Badge variant="secondary">{currentStartup.funding}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">{currentStartup.description}</p>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Key Metrics</h4>
            <p className="text-muted-foreground">{currentStartup.metrics}</p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => handleResponse(false)}
              variant="outline"
              size="lg"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              <X className="w-5 h-5 mr-2" />
              Not Interested
            </Button>
            <Button
              onClick={() => handleResponse(true)}
              size="lg"
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              <Heart className="w-5 h-5 mr-2" />
              Interested
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Your responses help us understand your investment criteria and improve future recommendations.
      </div>
    </div>
  );
};

export default InvestorCalibration;
