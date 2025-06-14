
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Building2, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface InvestorDashboardHeaderProps {
  userCompany?: string;
  subscription: string;
  onLogout: () => void;
}

const InvestorDashboardHeader = ({ 
  userCompany, 
  subscription, 
  onLogout 
}: InvestorDashboardHeaderProps) => {
  const getSearchLimit = () => {
    switch (subscription) {
      case 'premium': return 'Unlimited';
      case 'pro': return '100/month';
      default: return '5/month';
    }
  };

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Investor Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {userCompany || 'Investor'}!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/marketplace">
              <Button variant="outline">
                <Building2 className="w-4 h-4 mr-2" />
                Browse Marketplace
              </Button>
            </Link>
            <Badge 
              className={`${
                subscription === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                subscription === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                'bg-muted text-muted-foreground'
              } text-white border-0`}
            >
              {subscription.toUpperCase()} - {getSearchLimit()}
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

export default InvestorDashboardHeader;
