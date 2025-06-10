
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Brain, Target, TrendingUp } from "lucide-react";

interface CalibrationCompleteProps {
  onReset: () => void;
}

const CalibrationComplete = ({ onReset }: CalibrationCompleteProps) => {
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
          onClick={onReset}
          variant="outline"
          className="h-12"
        >
          Recalibrate Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalibrationComplete;
