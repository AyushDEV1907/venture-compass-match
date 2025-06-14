
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, TrendingUp, Eye, MessageSquare } from "lucide-react";

interface Recommendation {
  startup_id: string;
  startup_name: string;
  fundability_score: number;
  recommendation_score: number;
  sector: string;
  stage: string;
  location: string;
}

interface StartupDetail {
  id: string;
  name: string;
  description: string;
  sector: string;
  stage: string;
  location: string;
  logo: string;
  funding_target: string;
  team_size: string;
  revenue: string;
  traction: string;
  user_id: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  startup: StartupDetail;
  onViewProfile: (recommendation: Recommendation) => void;
  onMessage: (recommendation: Recommendation) => void;
}

const RecommendationCard = ({
  recommendation,
  startup,
  onViewProfile,
  onMessage,
}: RecommendationCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getMatchScore = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-lg">
              {startup.logo}
            </div>
            <div>
              <h3 className="font-semibold">{startup.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {startup.location}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getScoreColor(recommendation.fundability_score)}`}>
              {recommendation.fundability_score}/100
            </div>
            <div className="text-xs text-muted-foreground">Fundability</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {startup.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {startup.sector}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {startup.stage}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Team:</span> {startup.team_size}
          </div>
          <div>
            <span className="text-muted-foreground">Target:</span> {startup.funding_target}
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Match Score</span>
            <span className="text-sm text-blue-600 font-medium">
              {getMatchScore(recommendation.recommendation_score)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                style={{ width: `${Math.min(recommendation.recommendation_score, 100)}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.round(recommendation.recommendation_score)}%
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewProfile(recommendation)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            onClick={() => onMessage(recommendation)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
