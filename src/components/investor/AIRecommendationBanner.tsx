
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";

interface AIRecommendationBannerProps {
  reason: string;
}

const AIRecommendationBanner = ({ reason }: AIRecommendationBannerProps) => {
  if (!reason) return null;

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
              AI Recommendation
              <Sparkles className="w-4 h-4" />
            </h4>
            <p className="text-sm text-blue-600">{reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationBanner;
