
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { calibrationStartups, CalibrationStartup } from "@/components/investor/calibrationData";
import CalibrationProgress from "@/components/investor/CalibrationProgress";
import CalibrationStartupCard from "@/components/investor/CalibrationStartupCard";
import CalibrationComplete from "@/components/investor/CalibrationComplete";

interface InvestorCalibrationProps {
  onComplete: () => void;
}

const InvestorCalibration = ({ onComplete }: InvestorCalibrationProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [calibrationData, setCalibrationData] = useState<Array<{startup: CalibrationStartup, rating: number | null}>>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    return <CalibrationComplete onReset={resetCalibration} />;
  }

  const currentStartup = calibrationStartups[currentIndex];

  return (
    <div className="space-y-6">
      <CalibrationProgress 
        currentIndex={currentIndex}
        totalStartups={calibrationStartups.length}
        progress={progress}
      />
      <CalibrationStartupCard 
        startup={currentStartup}
        onRating={handleRating}
      />
    </div>
  );
};

export default InvestorCalibration;
