
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CalibrationProgressProps {
  currentIndex: number;
  totalStartups: number;
  progress: number;
}

const CalibrationProgress = ({ currentIndex, totalStartups, progress }: CalibrationProgressProps) => {
  return (
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
            <span>{currentIndex + 1} of {totalStartups}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
    </Card>
  );
};

export default CalibrationProgress;
