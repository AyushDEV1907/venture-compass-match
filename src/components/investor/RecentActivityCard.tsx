
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivityCard = () => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <span className="text-sm">Matched with TechFlow AI</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-sm">New message from MedLink</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          <span className="text-sm">Profile view from EcoTech</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
