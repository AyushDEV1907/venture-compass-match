
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";

interface SwipeActionsProps {
  onViewProfile: () => void;
  onSendMessage: () => void;
}

const SwipeActions = ({ onViewProfile, onSendMessage }: SwipeActionsProps) => {
  const handleViewProfile = () => {
    console.log('View profile clicked');
    onViewProfile();
  };

  const handleSendMessage = () => {
    console.log('Send message clicked');
    onSendMessage();
  };

  return (
    <div className="flex gap-4">
      <Button 
        variant="outline" 
        className="flex-1 h-12 hover:bg-accent hover:text-accent-foreground transition-colors" 
        onClick={handleViewProfile}
      >
        <Eye className="w-4 h-4 mr-2" />
        View Full Profile
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 h-12 hover:bg-accent hover:text-accent-foreground transition-colors" 
        onClick={handleSendMessage}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Send Message
      </Button>
    </div>
  );
};

export default SwipeActions;
