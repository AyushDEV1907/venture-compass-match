
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

interface CalibrationBannerProps {
  isCalibrated: boolean;
}

const CalibrationBanner = ({ isCalibrated }: CalibrationBannerProps) => {
  if (isCalibrated) return null;

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Target className="w-5 h-5" />
          Complete Your Calibration
        </CardTitle>
        <CardDescription>
          Review 5 demo startups to help our AI learn your investment preferences and improve recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          Start Calibration
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalibrationBanner;
