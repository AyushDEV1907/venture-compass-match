
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface RecommendationHeaderProps {
  recommendationsCount: number;
  onRefresh: () => void;
}

const RecommendationHeader = ({ recommendationsCount, onRefresh }: RecommendationHeaderProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-6 h-6" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          AI-curated startup matches based on your investment preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendationsCount === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recommendations Available</h3>
            <p className="text-muted-foreground">
              We're working on finding startups that match your criteria. Check back soon!
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{recommendationsCount} Recommendations</h3>
              <p className="text-muted-foreground">
                Ranked by match score and fundability
              </p>
            </div>
            <Button variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationHeader;
