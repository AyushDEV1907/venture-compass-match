
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X } from "lucide-react";

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

interface CalibrationStartupCardProps {
  startup: CalibrationStartup;
  onRating: (rating: number) => void;
}

const CalibrationStartupCard = ({ startup, onRating }: CalibrationStartupCardProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
              🚀
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{startup.name}</h3>
              <div className="flex gap-2 mb-3">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  {startup.sector}
                </Badge>
                <Badge variant="outline">{startup.stage}</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {startup.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="font-semibold">{startup.revenue}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="font-semibold">{startup.team}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Seeking</p>
              <p className="font-semibold">{startup.asking}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Key Metrics</p>
              <p className="font-semibold text-sm">{startup.metrics}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-center mb-4 font-medium">How interested would you be in investing?</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => onRating(1)}
                variant="outline"
                size="lg"
                className="flex-1 max-w-32 h-12 border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Not Interested
              </Button>
              <Button
                onClick={() => onRating(3)}
                variant="outline"
                size="lg"
                className="flex-1 max-w-32 h-12"
              >
                Maybe
              </Button>
              <Button
                onClick={() => onRating(5)}
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
  );
};

export default CalibrationStartupCard;
