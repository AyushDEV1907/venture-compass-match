import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Users, TrendingUp, DollarSign, MessageSquare, X, Heart } from "lucide-react";
import { StartupData } from "@/types";
import { useWatchlist } from "@/hooks/useWatchlist";

interface StartupProfileModalProps {
  startup: StartupData;
  isOpen: boolean;
  onClose: () => void;
  onMessage: () => void;
}

const StartupProfileModal = ({ startup, isOpen, onClose, onMessage }: StartupProfileModalProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(startup.id, 'startup');

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(startup.id, 'startup');
    } else {
      addToWatchlist(startup.id, 'startup');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                {startup.logo}
              </div>
              <div>
                <DialogTitle className="text-2xl">{startup.name}</DialogTitle>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                    {startup.sector}
                  </Badge>
                  <Badge variant="outline">{startup.stage}</Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed">{startup.description}</p>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-semibold">{startup.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-semibold">{startup.teamSize} people</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{startup.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Seeking</p>
                    <p className="font-semibold">{startup.fundingTarget}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traction */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Traction & Growth</h3>
              <p className="text-muted-foreground">{startup.traction}</p>
            </CardContent>
          </Card>

          {/* Pitch Deck */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Pitch Deck</h3>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Pitch deck available upon request</p>
                <Button variant="outline" className="mt-4">Request Access</Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              onClick={onMessage}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              size="lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleWatchlistToggle}
            >
              <Heart className={`w-4 h-4 mr-2 ${inWatchlist ? 'fill-current text-red-500' : ''}`} />
              {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
            <Button variant="outline" size="lg">
              Share Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartupProfileModal;
