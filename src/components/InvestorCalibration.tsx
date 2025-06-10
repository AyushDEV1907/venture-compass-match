
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Target, Heart, X, CheckCircle, Brain, TrendingUp } from "lucide-react";

interface CalibrationStartup {
  id: number;
  name: string;
  description: string;
  sector: string;
  stage: string;
  revenue: string;
  team: string;
  asking: string;
  metrics: string;
}

interface InvestorCalibrationProps {
  onComplete: () => void;
}

const InvestorCalibration = ({ onComplete }: InvestorCalibrationProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [calibrationData, setCalibrationData] = useState<Array<{startup: CalibrationStartup, rating: number | null}>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const calibrationStartups: CalibrationStartup[] = [
    {
      id: 1,
      name: "AI Vision Pro",
      description: "Computer vision platform that helps retailers reduce shrinkage by 45% through real-time theft detection and analytics.",
      sector: "AI/ML",
      stage: "Series A",
      revenue: "$150K ARR",
      team: "15 engineers",
      asking: "$3M",
      metrics: "95% accuracy, 200+ stores deployed"
    },
    {
      id: 2,
      name: "GreenCharge",
      description: "Solar-powered EV charging network targeting apartment complexes and office buildings with subscription-based model.",
      sector: "CleanTech",
      stage: "Seed",
      revenue: "$45K MRR",
      team: "8 people",
      asking: "$2M",
      metrics: "50 locations, 2000+ monthly users"
    },
    {
      id: 3,
      name: "MediConnect",
      description: "Telemedicine platform specializing in mental health services with AI-powered therapist matching and 24/7 crisis support.",
      sector: "HealthTech",
      stage: "Series A",
      revenue: "$300K ARR",
      team: "25 people",
      asking: "$5M",
      metrics: "10K+ patients, 500+ therapists"
    },
    {
      id: 4,
      name: "CodeMentor AI",
      description: "AI-powered coding assistant that provides real-time code review, bug detection, and learning recommendations for developers.",
      sector: "EdTech",
      stage: "Seed",
      revenue: "$80K MRR",
      team: "12 engineers",
      asking: "$1.5M",
      metrics: "50K+ developers, 40% monthly retention"
    },
    {
      id: 5,
      name: "FlexWork",
      description: "B2B platform connecting companies with vetted remote freelancers, featuring AI-powered skill matching and project management tools.",
      sector: "SaaS",
      stage: "Pre-seed",
      revenue: "$25K MRR",
      team: "6 people",
      asking: "$800K",
      metrics: "1000+ freelancers, 150+ companies"
    }
  ];

  useEffect(() => {
    const initializeCalibration = () => {
      setIsLoading(true);
      
      try {
        // Initialize calibration data
        const initialData = calibrationStartups.map(startup => ({ startup, rating: null }));
        setCalibrationData(initialData);
        
        // Check if already calibrated and restore state
        const isCalibrated = localStorage.getItem('investorCalibrated') === 'true';
        const calibrationComplete = localStorage.getItem('calibrationComplete');
        const calibrationLearning = localStorage.getItem('calibrationLearning');
        
        console.log('Calibration status:', { isCalibrated, calibrationComplete, calibrationLearning });
        
        // If user was previously calibrated, restore their state
        if (isCalibrated && calibrationComplete && calibrationLearning) {
          setIsComplete(true);
          
          // Restore previous ratings if available
          try {
            const learningData = JSON.parse(calibrationLearning);
            const restoredData = initialData.map(item => {
              const previousRating = learningData.find((learning: any) => learning.startupId === item.startup.id);
              return {
                ...item,
                rating: previousRating ? previousRating.rating : null
              };
            });
            setCalibrationData(restoredData);
            
            toast({
              title: "Welcome back!",
              description: "Your calibration preferences have been restored."
            });
          } catch (error) {
            console.error('Error restoring calibration data:', error);
          }
        } else {
          setIsComplete(false);
        }
      } catch (error) {
        console.error('Error initializing calibration:', error);
        setIsComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCalibration();
  }, []);

  const handleRating = (rating: number) => {
    const newData = [...calibrationData];
    newData[currentIndex].rating = rating;
    setCalibrationData(newData);

    // Store individual rating for ML learning
    const learningData = {
      startupId: calibrationStartups[currentIndex].id,
      rating,
      sector: calibrationStartups[currentIndex].sector,
      stage: calibrationStartups[currentIndex].stage,
      revenue: calibrationStartups[currentIndex].revenue,
      timestamp: new Date().toISOString()
    };
    
    const existingLearning = JSON.parse(localStorage.getItem('calibrationLearning') || '[]');
    const updatedLearning = existingLearning.filter((item: any) => item.startupId !== learningData.startupId);
    localStorage.setItem('calibrationLearning', JSON.stringify([...updatedLearning, learningData]));

    if (currentIndex < calibrationStartups.length - 1) {
      setCurrentIndex(currentIndex + 1);
      toast({
        title: "Rating Saved",
        description: `Thank you for rating ${calibrationStartups[currentIndex].name}`
      });
    } else {
      completeCalibration();
    }
  };

  const completeCalibration = () => {
    setIsComplete(true);
    localStorage.setItem('investorCalibrated', 'true');
    
    // Analyze calibration data for preferences
    const sectors = calibrationData.map(d => ({ sector: d.startup.sector, rating: d.rating || 0 }));
    const stages = calibrationData.map(d => ({ stage: d.startup.stage, rating: d.rating || 0 }));
    
    localStorage.setItem('calibrationComplete', JSON.stringify({
      sectors,
      stages,
      completedAt: new Date().toISOString()
    }));
    
    toast({
      title: "Calibration Complete! 🎉",
      description: "Your preferences have been learned. You'll now get better startup recommendations."
    });
    
    onComplete();
  };

  const resetCalibration = () => {
    setIsComplete(false);
    setCurrentIndex(0);
    const resetData = calibrationStartups.map(startup => ({ startup, rating: null }));
    setCalibrationData(resetData);
    
    // Clear localStorage
    localStorage.removeItem('investorCalibrated');
    localStorage.removeItem('calibrationComplete');
    localStorage.removeItem('calibrationLearning');
    
    toast({
      title: "Calibration Reset",
      description: "Starting fresh calibration process."
    });
  };

  const progress = ((currentIndex + (isComplete ? 1 : 0)) / calibrationStartups.length) * 100;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calibration...</p>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Calibration Complete!</h3>
          <p className="text-muted-foreground mb-6">
            Your investment preferences have been learned. Our AI will now provide more accurate startup recommendations based on your ratings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <Brain className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium">AI Trained</p>
              <p className="text-sm text-muted-foreground">Your preferences learned</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium">Better Matches</p>
              <p className="text-sm text-muted-foreground">More relevant startups</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium">Continuous Learning</p>
              <p className="text-sm text-muted-foreground">Improves with each swipe</p>
            </div>
          </div>
          <Button 
            onClick={resetCalibration}
            variant="outline"
            className="h-12"
          >
            Recalibrate Preferences
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentStartup = calibrationStartups[currentIndex];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Investment Calibration
          </CardTitle>
          <CardDescription>
            Rate 5 demo startups to train our AI on your investment preferences
          </CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentIndex + 1} of {calibrationStartups.length}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                🚀
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{currentStartup.name}</h3>
                <div className="flex gap-2 mb-3">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                    {currentStartup.sector}
                  </Badge>
                  <Badge variant="outline">{currentStartup.stage}</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {currentStartup.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="font-semibold">{currentStartup.revenue}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="font-semibold">{currentStartup.team}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Seeking</p>
                <p className="font-semibold">{currentStartup.asking}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Key Metrics</p>
                <p className="font-semibold text-sm">{currentStartup.metrics}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-center mb-4 font-medium">How interested would you be in investing?</p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleRating(1)}
                  variant="outline"
                  size="lg"
                  className="flex-1 max-w-32 h-12 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Not Interested
                </Button>
                <Button
                  onClick={() => handleRating(3)}
                  variant="outline"
                  size="lg"
                  className="flex-1 max-w-32 h-12"
                >
                  Maybe
                </Button>
                <Button
                  onClick={() => handleRating(5)}
                  size="lg"
                  className="flex-1 max-w-32 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Very Interested
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorCalibration;
