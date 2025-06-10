
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";

interface SwipeActionsProps {
  onViewProfile: () => void;
  onSendMessage: () => void;
}

const SwipeActions = ({ onViewProfile, onSendMessage }: SwipeActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button variant="outline" className="flex-1 h-12" onClick={onViewProfile}>
        <Eye className="w-4 h-4 mr-2" />
        View Full Profile
      </Button>
      <Button variant="outline" className="flex-1 h-12" onClick={onSendMessage}>
        <MessageSquare className="w-4 h-4 mr-2" />
        Send Message
      </Button>
    </div>
  );
};

export default SwipeActions;
