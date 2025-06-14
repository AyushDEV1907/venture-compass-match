
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  userProfile: any;
  subscription: string;
  onLogout: () => void;
}

const DashboardHeader = ({ userProfile, subscription, onLogout }: DashboardHeaderProps) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Startup Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {userProfile?.company || 'Startup'}!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/marketplace">
              <Button variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                Browse Investors
              </Button>
            </Link>
            <Badge 
              className={`${
                subscription === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                subscription === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                'bg-muted text-muted-foreground'
              } text-white border-0`}
            >
              {subscription.toUpperCase()}
            </Badge>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
