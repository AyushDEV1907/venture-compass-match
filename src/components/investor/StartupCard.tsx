
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, TrendingUp, Building2, Heart, X } from "lucide-react";
import { StartupData } from "@/types";

interface StartupCardProps {
  startup: StartupData;
  onSwipe: (interested: boolean) => void;
}

const StartupCard = ({ startup, onSwipe }: StartupCardProps) => {
  return (
    <Card className="border-0 shadow-2xl overflow-hidden">
      <div className="relative h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                {startup.logo}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{startup.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                    {startup.sector}
                  </Badge>
                  <Badge variant="outline">{startup.stage}</Badge>
                  {startup.recommendationScore && (
                    <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
                      {startup.recommendationScore}% match
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {startup.description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="font-semibold">{startup.revenue}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="font-semibold">{startup.teamSize} people</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{startup.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Building2 className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Seeking</p>
                  <p className="font-semibold">{startup.fundingTarget}</p>
                </div>
              </div>
            </div>

            {/* Traction */}
            <div className="p-4 bg-white rounded-lg mb-6">
              <h4 className="font-semibold mb-2">Key Traction</h4>
              <p className="text-muted-foreground">{startup.traction}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              <Button
                onClick={() => onSwipe(false)}
                variant="outline"
                size="lg"
                className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="w-5 h-5 mr-2" />
                Pass
              </Button>
              <Button
                onClick={() => onSwipe(true)}
                size="lg"
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <Heart className="w-5 h-5 mr-2" />
                Interested
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StartupCard;
