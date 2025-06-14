
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Building2, BarChart3 } from "lucide-react";

const InvestmentReadinessCard = () => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Investment Readiness</CardTitle>
        <CardDescription>Your current status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold">Fundability Score</p>
                <p className="text-sm text-muted-foreground">Get AI assessment</p>
              </div>
            </div>
            <Badge variant="outline">Pending</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold">Profile Complete</p>
                <p className="text-sm text-muted-foreground">All sections filled</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">Complete</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="font-semibold">Pitch Deck</p>
                <p className="text-sm text-muted-foreground">Upload materials</p>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentReadinessCard;
