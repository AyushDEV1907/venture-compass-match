
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Target, Calendar } from "lucide-react";

const QuickActionsCard = () => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your startup presence</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        <Button className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white justify-start">
          <Award className="w-6 h-6 mr-4" />
          <div className="text-left">
            <div className="font-semibold">Check Fundability Score</div>
            <div className="text-sm opacity-90">Get AI assessment</div>
          </div>
        </Button>
        <Button variant="outline" className="h-16 justify-start">
          <Target className="w-6 h-6 mr-4" />
          <div className="text-left">
            <div className="font-semibold">View Improvement Plan</div>
            <div className="text-sm text-muted-foreground">Enhance your profile</div>
          </div>
        </Button>
        <Button variant="outline" className="h-16 justify-start">
          <Calendar className="w-6 h-6 mr-4" />
          <div className="text-left">
            <div className="font-semibold">Quarterly Check-in</div>
            <div className="text-sm text-muted-foreground">Update progress</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
