
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, DollarSign, Star, MessageSquare, X, Building2 } from "lucide-react";
import { InvestorData } from "@/types";

interface InvestorProfileModalProps {
  investor: InvestorData;
  isOpen: boolean;
  onClose: () => void;
  onMessage: () => void;
}

const InvestorProfileModal = ({ investor, isOpen, onClose, onMessage }: InvestorProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                {investor.logo}
              </div>
              <div>
                <DialogTitle className="text-2xl">{investor.name}</DialogTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {investor.sectors.slice(0, 3).map(sector => (
                    <Badge key={sector} className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
                      {sector}
                    </Badge>
                  ))}
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
              <p className="text-muted-foreground leading-relaxed">{investor.description}</p>
            </CardContent>
          </Card>

          {/* Investment Focus */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Investment Focus</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Preferred Sectors</h4>
                  <div className="flex flex-wrap gap-1">
                    {investor.sectors.map(sector => (
                      <Badge key={sector} variant="outline" className="text-xs">{sector}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Investment Stages</h4>
                  <div className="flex flex-wrap gap-1">
                    {investor.stages.map(stage => (
                      <Badge key={stage} variant="outline" className="text-xs">{stage}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Ticket Size</h4>
                  <p className="text-sm font-medium">{investor.ticketSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{investor.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Star className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio</p>
                    <p className="font-semibold">{investor.portfolio}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Check Size</p>
                    <p className="font-semibold">{investor.ticketSize}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Companies */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Notable Investments</h3>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Portfolio details available upon connection</p>
                <Button variant="outline" className="mt-4">View Public Portfolio</Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              onClick={onMessage}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white"
              size="lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" size="lg">
              Follow Investor
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

export default InvestorProfileModal;
