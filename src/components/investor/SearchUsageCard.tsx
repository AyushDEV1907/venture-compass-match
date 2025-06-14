
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface SearchUsageCardProps {
  subscription: string;
}

const SearchUsageCard = ({ subscription }: SearchUsageCardProps) => {
  const getSearchLimit = () => {
    switch (subscription) {
      case 'premium': return 'Unlimited';
      case 'pro': return '100/month';
      default: return '5/month';
    }
  };

  const getUsedSearches = () => {
    switch (subscription) {
      case 'premium': return 'N/A';
      case 'pro': return '42/100';
      default: return '3/5';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Search Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>This month:</span>
            <span className="font-semibold">{getUsedSearches()}</span>
          </div>
          {subscription === 'free' && (
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-700">
                Upgrade to Pro for 100 searches per month or Premium for unlimited access.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchUsageCard;
